import '@testing-library/jest-dom';

// Mock import.meta for Vite environment variables
// @ts-expect-error - import.meta is not available in Jest
globalThis.import = {
  meta: {
    env: {
      VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:8000',
      MODE: 'test',
      DEV: false,
      PROD: false,
    },
  },
};

// Mock CSS.supports for cross-browser testing
if (typeof CSS !== 'undefined') {
  Object.defineProperty(CSS, 'supports', {
    value: jest.fn().mockReturnValue(true),
  });
}

// Mock performance.now for performance testing
if (typeof performance !== 'undefined') {
  Object.defineProperty(performance, 'now', {
    value: jest.fn().mockReturnValue(Date.now()),
  });
}