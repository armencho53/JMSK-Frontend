import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  UserCircleIcon,
  Bars3Icon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

interface HeaderProps {
  onMobileMenuToggle: () => void;
  sidebarCollapsed: boolean;
}

export default function Header({ onMobileMenuToggle, sidebarCollapsed }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(3); // Mock notification count
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header 
      className={`
        bg-white border-b border-slate-200 shadow-sm
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        transition-all duration-300 ease-in-out
      `}
      role="banner"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Mobile menu button and search */}
          <div className="flex items-center flex-1">
            {/* Mobile menu button */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              aria-label="Open mobile navigation menu"
              aria-expanded="false"
              aria-controls="mobile-navigation"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-lg ml-4 lg:ml-0" role="search">
              <form onSubmit={handleSearch} className="relative">
                <label htmlFor="global-search" className="sr-only">
                  Search orders, customers, and supplies
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="global-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    placeholder="Search orders, customers, supplies..."
                    aria-describedby="search-description"
                  />
                  <div id="search-description" className="sr-only">
                    Search across orders, customers, and supplies in the system
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right section - Notifications and profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button 
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              aria-label={`Notifications${notifications > 0 ? ` (${notifications} unread)` : ''}`}
              aria-describedby="notification-description"
            >
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              {notifications > 0 && (
                <span 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs rounded-full flex items-center justify-center text-white bg-orange-500"
                  aria-hidden="true"
                >
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
              <div id="notification-description" className="sr-only">
                {notifications > 0 ? `You have ${notifications} unread notifications` : 'No new notifications'}
              </div>
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                aria-label="User account menu"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
                id="user-menu-button"
              >
                <div className="flex items-center space-x-2">
                  <UserCircleIcon className="h-8 w-8 text-slate-400" aria-hidden="true" />
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-slate-900">
                      {user?.full_name || 'User'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <ChevronDownIcon 
                  className={`
                    h-4 w-4 text-slate-400 transition-transform duration-200
                    ${isProfileOpen ? 'rotate-180' : ''}
                  `} 
                  aria-hidden="true"
                />
              </button>

              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <div className="py-1">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-slate-100" role="none">
                      <div className="text-sm font-medium text-slate-900">
                        {user?.full_name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {user?.email}
                      </div>
                    </div>

                    {/* Menu items */}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        // TODO: Navigate to profile settings
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                      role="menuitem"
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-3 text-slate-400" aria-hidden="true" />
                      Settings
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                      role="menuitem"
                    >
                      <ArrowRightStartOnRectangleIcon className="h-4 w-4 mr-3 text-slate-400" aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}