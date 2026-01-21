
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

const routeNames: Record<string, string> = {
  '/': 'Dashboard',
  '/supplies': 'Supplies',
  '/customers': 'Customers',
  '/companies': 'Companies',
  '/orders': 'Orders',
  '/manufacturing': 'Manufacturing',
  '/departments': 'Departments',
  '/shipments': 'Shipments',
  '/roles': 'Roles',
};

export default function Breadcrumbs() {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Always start with home
    breadcrumbs.push({ name: 'Dashboard', href: '/' });
    
    // Build breadcrumbs from path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Check if this is a known route
      if (routeNames[currentPath]) {
        breadcrumbs.push({
          name: routeNames[currentPath],
          href: index === pathSegments.length - 1 ? undefined : currentPath
        });
      } else {
        // Handle dynamic routes (like customer detail)
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        if (routeNames[parentPath]) {
          // This is likely an ID or detail page
          breadcrumbs.push({
            name: `${routeNames[parentPath]} Detail`,
            href: undefined
          });
        }
      }
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  
  // Don't show breadcrumbs on the home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="h-4 w-4 mx-2 text-slate-400" />
            )}
            
            {breadcrumb.href ? (
              <Link
                to={breadcrumb.href}
                className="flex items-center text-sm font-medium transition-colors duration-200 text-slate-500 hover:text-slate-700"
              >
                {index === 0 && (
                  <HomeIcon className="h-4 w-4 mr-1" />
                )}
                {breadcrumb.name}
              </Link>
            ) : (
              <span className="flex items-center text-sm font-medium text-slate-900">
                {index === 0 && (
                  <HomeIcon className="h-4 w-4 mr-1" />
                )}
                {breadcrumb.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}