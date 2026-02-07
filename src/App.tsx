import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/authStore'
import { ThemeProvider } from './components/ThemeProvider'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Supplies from './pages/Supplies'
import Contacts from './pages/Contacts'
import ContactDetail from './pages/ContactDetail'
import Companies from './pages/Companies'
import CompanyDetail from './pages/CompanyDetail'
import Orders from './pages/Orders'
import Manufacturing from './pages/Manufacturing'
import Shipments from './pages/Shipments'
import Roles from './pages/Roles'
import Departments from './pages/Departments'
import Layout from './components/Layout'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token)
  console.log('PrivateRoute - token exists:', !!token)
  
  if (token) {
    console.log('Rendering authenticated content...')
    return <>{children}</>
  } else {
    console.log('Redirecting to login...')
    return <Navigate to="/login" />
  }
}

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter future={{ v7_startTransition: true }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              } >
              <Route index element={<Dashboard />} />
              <Route path="supplies" element={<Supplies />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="contacts/:contactId" element={<ContactDetail />} />
              <Route path="companies" element={<Companies />} />
              <Route path="companies/:companyId" element={<CompanyDetail />} />
              <Route path="orders" element={<Orders />} />
              <Route path="manufacturing" element={<Manufacturing />} />
              <Route path="departments" element={<Departments />} />
              <Route path="shipments" element={<Shipments />} />
              <Route path="roles" element={<Roles />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
