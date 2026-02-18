import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { config } from '../config'

const API_URL = config.apiUrl

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

// ============================================================================
// Contact API Functions
// ============================================================================

import type { Contact, ContactCreate, ContactUpdate } from '../types/contact'
import type { Company, CompanyCreate, CompanyUpdate, CompanyStatistics } from '../types/company'
import type { Address, AddressCreate, AddressUpdate, ShipmentAddress } from '../types/address'
import type { Order } from '../types/order'

/**
 * Fetch all contacts with optional filtering
 */
export const fetchContacts = async (params?: {
  skip?: number
  limit?: number
  search?: string
  company_id?: number
}): Promise<Contact[]> => {
  const response = await api.get('/contacts', { params })
  return response.data
}

/**
 * Fetch a single contact by ID
 */
export const fetchContactById = async (id: number): Promise<Contact> => {
  const response = await api.get(`/contacts/${id}`)
  return response.data
}

/**
 * Create a new contact
 */
export const createContact = async (data: ContactCreate): Promise<Contact> => {
  const response = await api.post('/contacts', data)
  return response.data
}

/**
 * Update an existing contact
 */
export const updateContact = async (id: number, data: ContactUpdate): Promise<Contact> => {
  const response = await api.put(`/contacts/${id}`, data)
  return response.data
}

/**
 * Delete a contact
 */
export const deleteContact = async (id: number): Promise<void> => {
  await api.delete(`/contacts/${id}`)
}

/**
 * Fetch order history for a specific contact
 */
export const fetchContactOrders = async (
  contactId: number,
  params?: { skip?: number; limit?: number }
): Promise<Order[]> => {
  const response = await api.get(`/contacts/${contactId}/orders`, { params })
  return response.data
}

// ============================================================================
// Company API Functions
// ============================================================================

/**
 * Fetch all companies with optional filtering
 */
export const fetchCompanies = async (params?: {
  skip?: number
  limit?: number
  search?: string
  include_balance?: boolean
}): Promise<Company[]> => {
  const response = await api.get('/companies-v2', { params })
  return response.data
}

/**
 * Fetch a single company by ID
 */
export const fetchCompanyById = async (
  id: number,
  params?: { include_contacts?: boolean; include_balance?: boolean }
): Promise<Company> => {
  const response = await api.get(`/companies-v2/${id}`, { params })
  return response.data
}

/**
 * Create a new company
 */
export const createCompany = async (data: CompanyCreate): Promise<Company> => {
  const response = await api.post('/companies-v2', data)
  return response.data
}

/**
 * Update an existing company
 */
export const updateCompany = async (id: number, data: CompanyUpdate): Promise<Company> => {
  const response = await api.put(`/companies-v2/${id}`, data)
  return response.data
}

/**
 * Delete a company
 */
export const deleteCompany = async (id: number): Promise<void> => {
  await api.delete(`/companies-v2/${id}`)
}

/**
 * Fetch all contacts for a specific company
 */
export const fetchCompanyContacts = async (
  companyId: number,
  params?: { skip?: number; limit?: number }
): Promise<Contact[]> => {
  const response = await api.get(`/companies-v2/${companyId}/contacts`, { params })
  return response.data
}

/**
 * Fetch all orders for a specific company
 */
export const fetchCompanyOrders = async (
  companyId: number,
  params?: { skip?: number; limit?: number; group_by_contact?: boolean }
): Promise<Order[]> => {
  const response = await api.get(`/companies-v2/${companyId}/orders`, { params })
  return response.data
}

/**
 * Fetch aggregated balance for a company
 */
export const fetchCompanyBalance = async (companyId: number): Promise<{ company_id: number; total_balance: number }> => {
  const response = await api.get(`/companies-v2/${companyId}/balance`)
  return response.data
}

/**
 * Fetch comprehensive statistics for a company
 */
export const fetchCompanyStatistics = async (companyId: number): Promise<CompanyStatistics> => {
  const response = await api.get(`/companies-v2/${companyId}/statistics`)
  return response.data
}

// ============================================================================
// Address API Functions
// ============================================================================

/**
 * Fetch all addresses for a specific company
 */
export const fetchCompanyAddresses = async (
  companyId: number,
  params?: { skip?: number; limit?: number }
): Promise<Address[]> => {
  const response = await api.get(`/companies/${companyId}/addresses`, { params })
  return response.data
}

/**
 * Fetch the default address for a company
 */
export const fetchDefaultAddress = async (companyId: number): Promise<Address | null> => {
  const response = await api.get(`/companies/${companyId}/addresses/default`)
  return response.data
}

/**
 * Create a new address for a company
 */
export const createAddress = async (
  companyId: number,
  data: AddressCreate,
  setAsDefault?: boolean
): Promise<Address> => {
  const response = await api.post(`/companies/${companyId}/addresses`, data, {
    params: { set_as_default: setAsDefault }
  })
  return response.data
}

/**
 * Fetch a single address by ID
 */
export const fetchAddressById = async (id: number): Promise<Address> => {
  const response = await api.get(`/addresses/${id}`)
  return response.data
}

/**
 * Update an existing address
 */
export const updateAddress = async (id: number, data: AddressUpdate): Promise<Address> => {
  const response = await api.put(`/addresses/${id}`, data)
  return response.data
}

/**
 * Delete an address
 */
export const deleteAddress = async (id: number): Promise<void> => {
  await api.delete(`/addresses/${id}`)
}

/**
 * Set an address as the default for its company
 */
export const setDefaultAddress = async (addressId: number, companyId: number): Promise<Address> => {
  const response = await api.post(`/addresses/${addressId}/set-default`, null, {
    params: { company_id: companyId }
  })
  return response.data
}

/**
 * Get default address for shipment population
 */
export const fetchShipmentAddress = async (companyId: number): Promise<ShipmentAddress | null> => {
  const response = await api.get(`/companies/${companyId}/addresses/shipment-default`)
  return response.data
}

// ============================================================================
// Lookup Value API Functions
// ============================================================================

import type { LookupValue, LookupValueCreate, LookupValueUpdate } from '../types/lookupValue'

/**
 * Fetch lookup values with optional category filter and inactive inclusion
 */
export const fetchLookupValues = async (
  category?: string,
  includeInactive?: boolean
): Promise<LookupValue[]> => {
  const params: Record<string, string | boolean> = {}
  if (category) params.category = category
  if (includeInactive) params.include_inactive = true
  const response = await api.get('/lookup-values', { params })
  return response.data
}

/**
 * Create a new lookup value
 */
export const createLookupValue = async (data: LookupValueCreate): Promise<LookupValue> => {
  const response = await api.post('/lookup-values', data)
  return response.data
}

/**
 * Update an existing lookup value
 */
export const updateLookupValue = async (id: number, data: LookupValueUpdate): Promise<LookupValue> => {
  const response = await api.put(`/lookup-values/${id}`, data)
  return response.data
}

/**
 * Delete (soft delete) a lookup value
 */
export const deleteLookupValue = async (id: number): Promise<void> => {
  await api.delete(`/lookup-values/${id}`)
}

/**
 * Seed default lookup values for the current tenant
 */
export const seedLookupDefaults = async (): Promise<void> => {
  await api.post('/lookup-values/seed')
}

// ============================================================================
// Metal API Functions
// ============================================================================

import type { Metal, MetalCreate, MetalUpdate } from '../types/metal'

export const fetchMetals = async (includeInactive?: boolean): Promise<Metal[]> => {
  const params: Record<string, boolean> = {}
  if (includeInactive) params.include_inactive = true
  const response = await api.get('/metals', { params })
  return response.data
}

export const createMetal = async (data: MetalCreate): Promise<Metal> => {
  const response = await api.post('/metals', data)
  return response.data
}

export const updateMetal = async (id: number, data: MetalUpdate): Promise<Metal> => {
  const response = await api.put(`/metals/${id}`, data)
  return response.data
}

export const deactivateMetal = async (id: number): Promise<void> => {
  await api.delete(`/metals/${id}`)
}

// ============================================================================
// Company Metal Balance API Functions
// ============================================================================

export interface CompanyMetalBalance {
  id: number
  metal_id: number
  metal_code: string
  metal_name: string
  balance_grams: number
}

export interface MetalDepositCreate {
  metal_id: number
  quantity_grams: number
  notes?: string
}

export const fetchCompanyMetalBalances = async (companyId: number): Promise<CompanyMetalBalance[]> => {
  const response = await api.get(`/companies/${companyId}/metal-balances`)
  return response.data
}

export const recordMetalDeposit = async (companyId: number, data: MetalDepositCreate): Promise<any> => {
  const response = await api.post(`/companies/${companyId}/metal-deposits`, data)
  return response.data
}
