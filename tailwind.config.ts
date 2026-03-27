/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C96A',
          bright: '#FFD700',
          dark: '#8B6914',
          muted: '#A07840',
        },
        obsidian: {
          DEFAULT: '#080808',
          card: '#0F0F0F',
          surface: '#141414',
          border: '#1E1E1E',
          hover: '#1A1A1A',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        crimson: ['"Crimson Pro"', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #8B6914 0%, #C9A84C 30%, #FFD700 50%, #C9A84C 70%, #8B6914 100%)',
        'gold-gradient-h': 'linear-gradient(90deg, #8B6914 0%, #C9A84C 30%, #FFD700 50%, #C9A84C 70%, #8B6914 100%)',
        'gold-border': 'linear-gradient(135deg, #8B6914, #FFD700, #8B6914)',
      },
      animation: {
        'shimmer': 'shimmer 3s linear infinite',
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(201, 168, 76, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
