import { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './features/**/*.{ts,tsx}', './shared/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFFBF0',
          100: '#FFF3D6',
          200: '#FFE4A0',
          300: '#FFD060',
          400: '#F5C040',
          500: '#E8A020',
          600: '#C4882A',
          700: '#9E6820',
          800: '#7A4E18',
          900: '#4A2C08',
          950: '#2C1A0A',
        },
        warm: {
          50:  '#FDFAF6',
          100: '#F5F0E8',
          200: '#EDE4D0',
          300: '#DDD0B8',
        },
      },
    },
  },
  plugins: [],
};

export default config;
