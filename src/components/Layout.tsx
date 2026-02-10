import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Layout() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Supplies', href: '/supplies', icon: '📦' },
    { name: 'Companies', href: '/companies', icon: '🏢' },
    { name: 'Orders', href: '/orders', icon: '📋' },
    { name: 'Manufacturing', href: '/manufacturing', icon: '⚙️' },
    { name: 'Shipments', href: '/shipments', icon: '🚚' },
    { name: 'Departments', href: '/departments', icon: '🏭' },
    { name: 'Roles', href: '/roles', icon: '🔐' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Professional Sidebar - Clean Modern Design */}
        <div className="w-64 bg-slate-900 shadow-xl h-screen fixed z-10">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JM</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Jewelry Manufacturing</h1>
                <p className="text-xs text-slate-400">Production System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive(item.href)
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }
                  `}
                >
                  <span className="mr-3 text-base">{item.icon}</span>
                  {item.name}
                  {isActive(item.href) && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* User Profile Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                <span className="text-slate-300 text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.email || 'User'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  Tenant ID: {user?.tenant_id || 'N/A'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200"
            >
              <span className="mr-2">🚪</span>
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="ml-64 flex-1 min-h-screen">
          {/* Professional Header */}
          <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-5">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-slate-600 mt-1">
                    Manage your jewelry manufacturing operations
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-slate-500">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="System Online"></div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
