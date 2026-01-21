import '@testing-library/jest-dom';

// Mock import.meta.env for Vite environment variables
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_URL: 'http://localhost:8000',
        MODE: 'test',
        DEV: false,
        PROD: false,
      },
    },
  },
});

// Mock CSS.supports for cross-browser testing
Object.defineProperty(CSS, 'supports', {
  value: jest.fn().mockReturnValue(true),
});

// Mock performance.now for performance testing
Object.defineProperty(performance, 'now', {
  value: jest.fn().mockReturnValue(Date.now()),
});