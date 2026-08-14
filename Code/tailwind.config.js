export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Botanical brand palette
        forest: {
          50: '#f0f6f1',
          100: '#dcecdf',
          200: '#b9d9c0',
          300: '#8fbe9c',
          400: '#5e9677',
          500: '#3d7358',
          600: '#2e5d46',
          700: '#244b3a',
          800: '#1e4033', // deep forest — primary brand
          900: '#173228',
        },
        sage: {
          50: '#f4f8f3',
          100: '#e9f1e7',
          200: '#d9e9d9', // sage — soft backgrounds
          300: '#c3d9c0',
          400: '#9dbe9a',
          500: '#7aa177',
          600: '#5c8459',
          700: '#486945',
          800: '#3a5238',
          900: '#2e3f2c',
        },
        cream: {
          50: '#f8faf6', // canvas
          100: '#f1f5ee',
          200: '#e7ede3',
          300: '#dce4d6',
        },
        ink: {
          50: '#f5f5f4',
          100: '#e7e7e4',
          200: '#cfcfc9',
          300: '#a9a9a2',
          400: '#8a8a84',
          500: '#6b6b6b', // secondary text
          600: '#55554f',
          700: '#3d3d38',
          800: '#2c2c28',
          900: '#222222', // primary text
        },
        gold: {
          50: '#fdf9ee',
          100: '#faf0d5',
          200: '#f4e0a8',
          300: '#eecc77',
          400: '#e7b44c',
          500: '#e0a527', // gold — highlights, ratings
          600: '#c48b1e',
          700: '#a06f17',
          800: '#7e5713',
          900: '#5c3f0e',
        },
        // Semantic layer — components reference intent, not raw color families
        danger: {
          50: '#fdf3f3',
          100: '#fbe0df',
          200: '#f5c2c0',
          300: '#ec9a96',
          400: '#df6b66',
          500: '#b3261e', // destructive actions (replaces raw red-500/600)
          600: '#9a1f18',
          700: '#7e1a14',
          800: '#651410',
          900: '#4f0f0c',
        },
        success: {
          100: '#dcecdf',
          500: '#2e5d46', // alias of forest-600 — confirmations
          600: '#244b3a',
        },
        warning: {
          100: '#faf0d5',
          500: '#e0a527', // alias of gold-500 — cautions
          600: '#c48b1e',
        },
        info: {
          100: '#dcecdf',
          500: '#5e9677', // alias of forest-400 — informational
          600: '#3d7358',
        },
      },
      fontFamily: {
        sans: ["'Manrope'", 'system-ui', 'sans-serif'],
        display: ["'Poppins'", "'Manrope'", 'system-ui', 'sans-serif'],
      },
      // Named type scale — components pick a role, not an ad hoc text-5xl
      fontSize: {
        display: ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.08', fontWeight: '800', letterSpacing: '-0.02em' }], // hero H1 only
        h1: ['clamp(2rem, 4.5vw, 2.75rem)', { lineHeight: '1.15', fontWeight: '700' }], // section titles
        h2: ['clamp(1.5rem, 3vw, 1.875rem)', { lineHeight: '1.25', fontWeight: '700' }], // subsection / card group titles
        h3: ['clamp(1.25rem, 2vw, 1.375rem)', { lineHeight: '1.35', fontWeight: '600' }], // card titles
        body: ['1.0625rem', { lineHeight: '1.6' }], // paragraph copy (17px)
        small: ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }], // meta / helper text
        stat: ['clamp(2rem, 4vw, 2.75rem)', { lineHeight: '1.1', fontWeight: '800', fontVariantNumeric: 'tabular-nums' }], // counters
      },
      borderRadius: {
        xl: '1rem', // 16px — modals, drawers, large surfaces
        '2xl': '1.25rem', // 20px — content cards (containers, not blobs)
        '3xl': '1.75rem', // 28px — reserved for feature/marketing moments
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(30, 64, 51, 0.08), 0 2px 8px -2px rgba(30, 64, 51, 0.06)',
        'soft-lg': '0 12px 32px -8px rgba(30, 64, 51, 0.14)',
        glow: '0 0 20px rgba(46, 93, 70, 0.25)',
        'glow-blue': '0 0 20px rgba(224, 165, 39, 0.3)',
      },
      backgroundImage: {
        'gradient-forest': 'linear-gradient(135deg, #2e5d46 0%, #1e4033 100%)',
        'gradient-subtle': 'linear-gradient(135deg, rgba(46, 93, 70, 0.08) 0%, rgba(224, 165, 39, 0.08) 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(23, 50, 40, 0.6) 0%, rgba(23, 50, 40, 0.35) 50%, rgba(23, 50, 40, 0.6) 100%)',
      },
    },
  },
  plugins: [],
}
