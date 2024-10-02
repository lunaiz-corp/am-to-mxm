import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '430px', // for iPhone 5/SE/.... (small phones)
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Apple SD Gothic Neo',
          'SF Pro',
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
