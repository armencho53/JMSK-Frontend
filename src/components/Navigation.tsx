import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  CubeIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  TruckIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Supplies', href: '/supplies', icon: CubeIcon },
  { name: 'Contacts', href: '/contacts', icon: UserGroupIcon },
  { name: 'Companies', href: '/companies', icon: BuildingOfficeIcon },
  { name: 'Orders', href: '/orders', icon: ClipboardDocumentListIcon },
  { name: 'Manufacturing', href: '/manufacturing', icon: CogIcon },
  { name: 'Departments', href: '/departments', icon: BuildingOfficeIcon },
  { name: 'Shipments', href: '/shipments', icon: TruckIcon },
  { name: 'Roles', href: '/roles', icon: UserIcon },
  { name: 'Lookup Values', href: '/lookup-values', icon: AdjustmentsHorizontalIcon },
];

interface NavigationProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Navigation({ 
  isCollapsed, 
  onToggle, 
  isMobile = false, 
  isOpen = false, 
  onClose 
}: NavigationProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleItemClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        
        {/* Mobile sidebar */}
        <aside 
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          role="navigation"
          aria-label="Main navigation"
          aria-hidden={!isOpen}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
            <h2 id="mobile-nav-heading" className="text-lg font-semibold text-slate-900 font-inter">Navigation</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              aria-label="Close navigation menu"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <nav className="mt-4 px-2" aria-labelledby="mobile-nav-heading">
            <ul role="list" className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={handleItemClick}
                      className={`
                        group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 
                        focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
                        ${active 
                          ? 'bg-slate-100 text-slate-900 border-r-2 border-slate-700' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }
                      `}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon 
                        className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                          active ? 'text-slate-700' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside 
      className={`
        hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-30
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        transition-all duration-300 ease-in-out
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex flex-col flex-grow bg-white shadow-lg border-r border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
          {!isCollapsed && (
            <h1 id="desktop-nav-heading" className="text-lg font-semibold text-slate-900 font-inter truncate">
              Jewelry Mfg
            </h1>
          )}
          <button
            onClick={onToggle}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!isCollapsed}
            aria-controls="desktop-navigation"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav 
          id="desktop-navigation"
          className="flex-1 px-2 py-4" 
          aria-labelledby={isCollapsed ? undefined : "desktop-nav-heading"}
          aria-label={isCollapsed ? "Main navigation" : undefined}
        >
          <ul role="list" className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 
                      focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
                      ${active 
                        ? 'bg-slate-100 text-slate-900 border-r-2 border-slate-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                    title={isCollapsed ? item.name : undefined}
                    aria-current={active ? 'page' : undefined}
                    aria-label={isCollapsed ? item.name : undefined}
                  >
                    <Icon 
                      className={`${isCollapsed ? 'h-6 w-6' : 'mr-3 h-5 w-5'} flex-shrink-0 transition-colors duration-200 ${
                        active ? 'text-slate-700' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                      aria-hidden="true"
                    />
                    {!isCollapsed && (
                      <span className="truncate font-inter">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}