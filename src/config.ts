// Environment configuration
// This file is mocked in tests via jest.config.js moduleNameMapper
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
}
