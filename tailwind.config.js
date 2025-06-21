/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#0F5E9C', // Institutional trust blue - primary
        'primary-50': '#EBF4FD', // Very light blue (50-level shade) - blue-50
        'primary-100': '#D1E7FA', // Light blue (100-level shade) - blue-100
        'primary-200': '#A3CFF5', // Medium light blue (200-level shade) - blue-200
        'primary-500': '#3B82F6', // Medium blue (500-level shade) - blue-500
        'primary-600': '#2563EB', // Medium dark blue (600-level shade) - blue-600
        'primary-700': '#1D4ED8', // Dark blue (700-level shade) - blue-700
        'primary-800': '#0F5E9C', // Primary institutional blue - blue-800
        'primary-900': '#1E3A8A', // Very dark blue (900-level shade) - blue-900

        // Secondary Colors
        'secondary': '#1D3557', // Professional depth navy - slate-800
        'secondary-50': '#F8FAFC', // Very light slate (50-level shade) - slate-50
        'secondary-100': '#F1F5F9', // Light slate (100-level shade) - slate-100
        'secondary-200': '#E2E8F0', // Medium light slate (200-level shade) - slate-200
        'secondary-500': '#64748B', // Medium slate (500-level shade) - slate-500
        'secondary-600': '#475569', // Medium dark slate (600-level shade) - slate-600
        'secondary-700': '#334155', // Dark slate (700-level shade) - slate-700
        'secondary-800': '#1D3557', // Secondary professional navy - slate-800
        'secondary-900': '#0F172A', // Very dark slate (900-level shade) - slate-900

        // Accent Colors
        'accent': '#FFD700', // Opportunity gold - yellow-400
        'accent-50': '#FEFCE8', // Very light yellow (50-level shade) - yellow-50
        'accent-100': '#FEF3C7', // Light yellow (100-level shade) - yellow-100
        'accent-200': '#FDE68A', // Medium light yellow (200-level shade) - yellow-200
        'accent-300': '#FCD34D', // Medium yellow (300-level shade) - yellow-300
        'accent-400': '#FFD700', // Accent opportunity gold - yellow-400
        'accent-500': '#F59E0B', // Medium dark yellow (500-level shade) - yellow-500
        'accent-600': '#D97706', // Dark yellow (600-level shade) - yellow-600

        // Background Colors
        'background': '#F8FAFE', // Soft clean canvas - blue-50
        'surface': '#FFFFFF', // Pure white surface - white

        // Text Colors
        'text-primary': '#1D3557', // High contrast primary text - slate-800
        'text-secondary': '#6B7280', // Subtle secondary text - gray-500
        'text-muted': '#9CA3AF', // Muted text - gray-400

        // Status Colors
        'success': '#2A9D8F', // Growth and positive outcomes - teal-600
        'success-50': '#F0FDFA', // Very light teal (50-level shade) - teal-50
        'success-100': '#CCFBF1', // Light teal (100-level shade) - teal-100
        'success-500': '#14B8A6', // Medium teal (500-level shade) - teal-500
        'success-600': '#2A9D8F', // Success growth teal - teal-600

        'warning': '#F59E0B', // Caution amber - amber-500
        'warning-50': '#FFFBEB', // Very light amber (50-level shade) - amber-50
        'warning-100': '#FEF3C7', // Light amber (100-level shade) - amber-100
        'warning-500': '#F59E0B', // Warning caution amber - amber-500

        'error': '#E63946', // High-risk red - red-600
        'error-50': '#FEF2F2', // Very light red (50-level shade) - red-50
        'error-100': '#FEE2E2', // Light red (100-level shade) - red-100
        'error-500': '#EF4444', // Medium red (500-level shade) - red-500
        'error-600': '#E63946', // Error high-risk red - red-600

        // Border Colors
        'border': '#E5E7EB', // Minimal borders - gray-200
        'border-focus': '#0F5E9C', // Active state borders - primary
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(15, 94, 156, 0.08)',
        'modal': '0 4px 16px rgba(15, 94, 156, 0.12)',
        'focus': '0 0 0 3px rgba(15, 94, 156, 0.1)',
      },
      animation: {
        'breathe': 'breathe 2s ease-in-out infinite',
        'slide-in': 'slideIn 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        slideIn: {
          'from': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}