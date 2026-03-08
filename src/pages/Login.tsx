import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formData = new URLSearchParams()
      formData.append('username', username)
      formData.append('password', password)
      formData.append('remember_me', rememberMe.toString())

      const { data } = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      // Set tokens first so they're available for the next request
      setAuth(data.access_token, data.refresh_token, null as any)

      // Fetch actual user data
      const userResponse = await api.get('/auth/me')
      const user = userResponse.data

      setAuth(data.access_token, data.refresh_token, user)
      navigate('/')
    } catch (err: any) {
      let errorMessage = 'Login failed'
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail
        } else if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map((e: any) => e.msg).join(', ')
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <Container size="md" padding="md">
        <Card variant="elevated" padding="lg" className="w-full max-w-md mx-auto">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Jewelry Manufacturing Tracker
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Sign in to your account
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded p-4 bg-red-50">
                  <p className="text-sm text-red-600">
                    {error}
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                <Input
                  type="text"
                  label="Username"
                  variant="floating"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                
                <Input
                  type="password"
                  label="Password"
                  variant="floating"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 accent-slate-800 border-slate-300"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                  Remember me for 30 days
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                fullWidth
                className="w-full"
              >
                Sign in
              </Button>
            </form>
          </div>
        </Card>
      </Container>
    </div>
  )
}
