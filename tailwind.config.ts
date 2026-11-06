import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        charm: {
          surface: '#F7F7F5',
          panel: '#FBFAF9',
          accent: '#F1F2EA',
          border: '#E7E6E5',
          heading: '#1C1917',
          body: '#57534E',
          muted: '#79716B',
          brand: {
            DEFAULT: '#E4544B',
            hover: '#D4473E',
            text: '#C9443A',
            deep: '#B83A32',
            light: '#FDE8E7',
            subtle: '#FFF5F4',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"DM Sans"', 'sans-serif'],
        mono: ['"Fragment Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1.25rem', // 20px
        '3xl': '1.5rem',  // 24px - standard Charm panel corners
      },
      boxShadow: {
        panel: '0 2px 8px -2px rgba(28, 25, 23, 0.04), 0 1px 2px -1px rgba(28, 25, 23, 0.02)',
        lift: '0 10px 25px -5px rgba(28, 25, 23, 0.08), 0 8px 10px -6px rgba(28, 25, 23, 0.04)',
        cta: '0 4px 14px 0 rgba(228, 84, 75, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
