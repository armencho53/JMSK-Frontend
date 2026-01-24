import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
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
        dead_code: true,
        conditionals: true,
        comparisons: true,
        sequences: true,
        properties: true,
        unused: true,
      }
    },
    // Code splitting for better caching and performance
    rollupOptions: {
      output: {
        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Simplified manual chunking to avoid React duplication issues
        manualChunks: {
          // Keep all vendor code together to prevent duplicate React instances
          vendor: ['react', 'react-dom', 'react-router-dom', 'axios', 'zustand', '@tanstack/react-query', 'react-hot-toast']
        }
      }
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Disable source maps for production (smaller bundle)
    sourcemap: false,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize assets
    assetsInlineLimit: 4096,
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
    ]
  },
  resolve: {
    // Deduplicate React to prevent multiple instances
    dedupe: ['react', 'react-dom', 'react/jsx-runtime']
  },
  // CSS optimization
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
})
