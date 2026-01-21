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
  XMarkIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Supplies', href: '/supplies', icon: CubeIcon },
  { name: 'Customers', href: '/customers', icon: UserGroupIcon },
  { name: 'Companies', href: '/companies', icon: BuildingOfficeIcon },
  { name: 'Orders', href: '/orders', icon: ClipboardDocumentListIcon },
  { name: 'Manufacturing', href: '/manufacturing', icon: CogIcon },
  { name: 'Departments', href: '/departments', icon: BuildingOfficeIcon },
  { name: 'Shipments', href: '/shipments', icon: TruckIcon },
  { name: 'Roles', href: '/roles', icon: UserIcon },
];

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleItemClick = () => {
    onClose();
  };

  // Professional theme classes
  const themeClasses = {
    overlay: 'bg-black bg-opacity-50',
    sidebar: 'bg-white shadow-lg',
    header: 'border-slate-200',
    headerText: 'text-slate-900',
    closeButton: 'text-slate-500 hover:text-slate-900 hover:bg-slate-50',
    navItem: 'text-slate-900 hover:bg-slate-50 hover:text-orange-600',
    navItemActive: 'bg-slate-100 text-slate-900 border-r-2 border-slate-900',
    icon: 'text-slate-500',
    iconActive: 'text-slate-900'
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className={`fixed inset-0 z-40 ${themeClasses.overlay} lg:hidden`}
          onClick={onClose}
        />
      )}
      
      {/* Mobile sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 ${themeClasses.sidebar} transform transition-transform duration-300 ease-in-out lg:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className={`flex items-center justify-between h-16 px-6 border-b ${themeClasses.header}`}>
          <h2 className={`text-lg font-semibold ${themeClasses.headerText}`}>
            Navigation
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-md transition-colors duration-200 touch-target ${themeClasses.closeButton}`}
            aria-label="Close navigation"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Navigation items */}
        <nav className="mt-6 px-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleItemClick}
                className={`
                  mobile-nav-item transition-all duration-200
                  ${active 
                    ? themeClasses.navItemActive
                    : themeClasses.navItem
                  }
                `}
              >
                <Icon className={`
                  mr-4 h-6 w-6 flex-shrink-0
                  ${active ? themeClasses.iconActive : themeClasses.icon}
                `} />
                <span className="font-medium">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
                <ChevronRightIcon className={`
                  ml-auto h-5 w-5 opacity-60
                  ${active ? themeClasses.iconActive : themeClasses.icon}
                `} />
              </Link>
            );
          })}
        </nav>
        
        {/* Footer section for additional mobile-specific actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-opacity-20">
          <div className="text-xs opacity-60 text-center">
            Jewelry Manufacturing System
          </div>
        </div>
      </div>
    </>
  );
}

export interface BottomNavigationProps {
  className?: string;
}

export function BottomNavigation({ className = '' }: BottomNavigationProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  // Primary navigation items for bottom nav
  const primaryItems = navigationItems.slice(0, 5);

  // Professional theme classes
  const themeClasses = {
    container: 'bg-white border-slate-200',
    item: 'text-slate-500 hover:text-slate-900',
    itemActive: 'text-slate-900',
    badge: 'bg-orange-500 text-white'
  };

  return (
    <nav className={`
      fixed bottom-0 left-0 right-0 z-30 
      ${themeClasses.container} border-t
      safe-area-inset-bottom
      ${className}
    `}>
      <div className="flex items-center justify-around px-2 py-2">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex flex-col items-center justify-center
                touch-target-lg transition-colors duration-200
                ${active ? themeClasses.itemActive : themeClasses.item}
              `}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {item.badge && (
                  <span className={`
                    absolute -top-2 -right-2 h-5 w-5 
                    ${themeClasses.badge} text-xs rounded-full 
                    flex items-center justify-center
                  `}>
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}