/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      colors: {
        navy: '#0A0F1E',
        panel: '#0F1629',
        danger: '#FF2D2D',
        safe: '#10B981',
        warn: '#F59E0B'
      },
      boxShadow: {
        danger: '0 8px 32px rgba(255,45,45,0.15)',
        glass: '0 4px 24px rgba(0,0,0,0.4)'
      },
      keyframes: {
        ticker: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        radar: { '0%': { transform: 'scale(0.2)', opacity: '0.85' }, '100%': { transform: 'scale(3.6)', opacity: '0' } },
        blink: { '0%, 45%': { opacity: '1' }, '46%, 100%': { opacity: '0' } }
      },
      animation: {
        ticker: 'ticker 28s linear infinite',
        radar: 'radar 1.4s ease-out infinite',
        blink: 'blink 1s step-end infinite'
      }
    }
  },
  plugins: []
};
