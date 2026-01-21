import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh for better development experience
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic',
    })
  ],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    // Optimize for production
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
        // Remove unused code
        dead_code: true,
        // Optimize conditionals
        conditionals: true,
        // Optimize comparisons
        comparisons: true,
        // Optimize sequences
        sequences: true,
        // Optimize properties
        properties: true,
        // Remove unused variables
        unused: true,
      },
      mangle: {
        // Mangle property names for smaller bundle
        properties: {
          regex: /^_/
        }
      }
    },
    // Code splitting for better caching and performance
    rollupOptions: {
      output: {
        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const extType = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return 'assets/css/[name]-[hash].[ext]';
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return 'assets/images/[name]-[hash].[ext]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return 'assets/fonts/[name]-[hash].[ext]';
          }
          return `assets/${extType}/[name]-[hash].[ext]`;
        },
        // Advanced manual chunking for optimal loading
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // State management and data fetching
            if (id.includes('zustand') || id.includes('@tanstack/react-query')) {
              return 'state-vendor';
            }
            // HTTP client
            if (id.includes('axios')) {
              return 'http-vendor';
            }
            // UI and styling
            if (id.includes('heroicons') || id.includes('react-hot-toast')) {
              return 'ui-vendor';
            }
            // Other vendor libraries
            return 'vendor';
          }
          
          // Application chunks
          if (id.includes('/src/components/ui/')) {
            return 'ui-components';
          }
          if (id.includes('/src/components/')) {
            return 'components';
          }
          if (id.includes('/src/pages/')) {
            return 'pages';
          }
          if (id.includes('/src/lib/')) {
            return 'utils';
          }
        }
      }
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 800,
    // Disable source maps for production (smaller bundle)
    sourcemap: false,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    // Enable minification of CSS
    cssMinify: true,
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'axios', 
      'zustand', 
      '@tanstack/react-query',
      'react-hot-toast',
      '@heroicons/react/24/outline',
      '@heroicons/react/24/solid'
    ],
    // Exclude large dependencies that should be loaded on demand
    exclude: []
  },
  // CSS optimization
  css: {
    // Enable CSS modules for better scoping
    modules: {
      localsConvention: 'camelCase'
    }
    // PostCSS will use postcss.config.js automatically
  },
  // Enable experimental features for better performance
  esbuild: {
    // Remove console logs in production
    drop: ['console', 'debugger'],
    // Optimize for size
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  }
})
