/**
 * Basic smoke test for the App component.
 */

jest.mock('./store/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 1, email: 'test@example.com', full_name: 'Test User' },
    token: 'mock-token',
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn(),
    checkAuth: jest.fn(),
  }),
}));

jest.mock('react-hot-toast', () => ({
  toast: { success: jest.fn(), error: jest.fn(), loading: jest.fn() },
  Toaster: () => null,
}));

jest.mock('./lib/api', () => ({
  default: {
    defaults: { baseURL: 'http://localhost:8000' },
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

jest.mock('./pages/Login', () => () => <div>Login</div>);
jest.mock('./pages/Dashboard', () => () => <div>Dashboard</div>);
jest.mock('./components/Layout', () => () => <div>Layout</div>);
jest.mock('./pages/Supplies', () => () => <div>Supplies</div>);
jest.mock('./pages/Companies', () => () => <div>Companies</div>);
jest.mock('./pages/CompanyDetail', () => () => <div>CompanyDetail</div>);
jest.mock('./pages/Contacts', () => () => <div>Contacts</div>);
jest.mock('./pages/ContactDetail', () => () => <div>ContactDetail</div>);
jest.mock('./pages/Orders', () => () => <div>Orders</div>);
jest.mock('./pages/OrderDetail', () => () => <div>OrderDetail</div>);
jest.mock('./pages/DepartmentLedger', () => () => <div>DepartmentLedger</div>);
jest.mock('./pages/Shipments', () => () => <div>Shipments</div>);
jest.mock('./pages/Roles', () => () => <div>Roles</div>);
jest.mock('./pages/Departments', () => () => <div>Departments</div>);
jest.mock('./pages/Metals', () => () => <div>Metals</div>);
jest.mock('./pages/LookupValues', () => () => <div>LookupValues</div>);
jest.mock('./components/ThemeProvider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('App', () => {
  test('imports without errors', () => {
    expect(() => require('./App')).not.toThrow();
  });
});
