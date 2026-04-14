/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: {
          base: '#020617',
          surface: '#0B1220',
          elevated: '#111a2e',
          raised: '#16213d',
        },
        border: {
          subtle: 'rgba(148, 163, 184, 0.08)',
          DEFAULT: 'rgba(148, 163, 184, 0.14)',
          strong: 'rgba(148, 163, 184, 0.24)',
        },
        brand: {
          gold: '#EAB308',
          goldlight: '#FACC15',
          golddark: '#CA8A04',
          red: '#DC2626',
          redlight: '#EF4444',
        },
        status: {
          active: '#22C55E',
          delinquent: '#F59E0B',
          escalated: '#EF4444',
          legal: '#A855F7',
          plan: '#3B82F6',
        },
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(234, 179, 8, 0.35)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'grid-faint': 'linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)',
      },
      animation: {
        'pulse-slow': 'pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
