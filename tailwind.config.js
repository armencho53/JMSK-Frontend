/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Include component files for proper purging
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  // Safelist important classes that might be generated dynamically
  safelist: [
    // Professional theme classes
    'theme-bg-primary',
    'theme-text-primary',
    'professional-primary-900',
    // Grid classes
    'grid-cols-1',
    'grid-cols-2', 
    'grid-cols-3',
    'grid-cols-4',
    'col-span-1',
    'col-span-2',
    // Responsive classes
    'sm:grid-cols-2',
    'md:grid-cols-2',
    'lg:grid-cols-4',
    'xl:grid-cols-4',
    // Animation classes
    'animate-spin',
    'animate-pulse',
    'animate-fade-in',
    'animate-slide-up',
    // Color classes that might be used
    'bg-red-500',
    'text-white',
    'bg-slate-50',
    'text-slate-900',
  ],
  theme: {
    // Mobile-first responsive breakpoints
    screens: {
      'xs': '475px',    // Extra small devices
      'sm': '640px',    // Small devices (landscape phones)
      'md': '768px',    // Medium devices (tablets)
      'lg': '1024px',   // Large devices (laptops)
      'xl': '1280px',   // Extra large devices (desktops)
      '2xl': '1536px',  // 2X large devices (large desktops)
      // Touch-specific breakpoints
      'touch': { 'raw': '(hover: none) and (pointer: coarse)' },
      'no-touch': { 'raw': '(hover: hover) and (pointer: fine)' },
    },
    extend: {
      // Professional color palette - Clean Modern Business Aesthetic
      colors: {
        // Modern Professional Theme
        professional: {
          primary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a', // Midnight Blue
          },
          secondary: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#ea580c', // Copper
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          },
          tertiary: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280', // Silver
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          },
          background: {
            primary: '#fefefe', // Pearl
            secondary: '#f1f5f9',
          },
          success: '#16a34a', // Malachite
          warning: '#ca8a04', // Citrine
          error: '#dc2626', // Carnelian
        },
      },
      
      // Typography - Modern Professional
      fontFamily: {
        'professional-heading': ['Inter', 'system-ui', 'sans-serif'],
        'professional-body': ['Inter', 'system-ui', 'sans-serif'],
        'professional-mono': ['JetBrains Mono', 'monospace'],
      },
      
      // Enhanced spacing scale for jewelry precision
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
        // Touch-friendly spacing
        'touch-sm': '2.75rem',  // 44px - minimum touch target
        'touch-md': '3rem',     // 48px - comfortable touch target
        'touch-lg': '3.5rem',   // 56px - large touch target
        // Desktop-optimized spacing
        'desktop-xs': '0.75rem',
        'desktop-sm': '1rem',
        'desktop-md': '1.5rem',
        'desktop-lg': '2rem',
        'desktop-xl': '3rem',
        'desktop-2xl': '4rem',
      },
      
      // Custom sizing utilities
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        // Mobile-first container sizes
        'mobile': '100%',
        'tablet': '48rem',
        'desktop': '64rem',
        'wide': '80rem',
        // Desktop-specific sizes
        'desktop-sm': '72rem',
        'desktop-lg': '88rem',
        'desktop-xl': '96rem',
      },
      
      // Touch-friendly minimum sizes
      minHeight: {
        'touch': '2.75rem',     // 44px minimum touch target
        'touch-lg': '3.5rem',   // 56px large touch target
      },
      
      minWidth: {
        'touch': '2.75rem',     // 44px minimum touch target
        'touch-lg': '3.5rem',   // 56px large touch target
      },
      
      // Enhanced border radius for luxury feel
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      
      // Professional shadows - Clean and subtle
      boxShadow: {
        'professional': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'professional-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      
      // Animation and transitions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
