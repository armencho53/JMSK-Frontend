import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// Handle environment variables for Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Optimized axios instance for CloudFront/Lambda
export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 30000, // 30s timeout for Lambda cold starts
  headers: {
    'Content-Type': 'application/json',
  },
  // Enable compression
  decompress: true,
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Track if we're currently refreshing to avoid multiple simultaneous refresh attempts
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response interceptor - handle errors and auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If this is the refresh endpoint failing, logout immediately
      if (originalRequest.url?.includes('/auth/refresh')) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      // Check if we have a refresh token
      const refreshToken = useAuthStore.getState().refreshToken
      if (!refreshToken) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Attempt to refresh the token
        const formData = new URLSearchParams()
        formData.append('refresh_token', refreshToken)

        const { data } = await axios.post(
          `${API_URL}/api/v1/auth/refresh`,
          formData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )

        // Update token in store (keep existing refreshToken and user)
        const { refreshToken: existingRefreshToken, user } = useAuthStore.getState()
        useAuthStore.getState().setAuth(data.access_token, existingRefreshToken!, user!)

        // Update authorization header
        api.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token
        originalRequest.headers.Authorization = 'Bearer ' + data.access_token

        processQueue(null, data.access_token)

        // Retry the original request
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
