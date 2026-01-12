/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,tsx,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        nba: {
          blue: '#00471B', // NBA/Bucks-ish blue
          red: '#C8102E',  // NBA red
          orange: '#FF4500', // Highlight orange
        }
      },
      aspectRatio: {
        '16/9': '16 / 9',
        '1/1': '1 / 1',
      },
      animation: {
        'fire-flicker': 'fireFlicker 0.8s ease-in-out infinite alternate',
        'fire-flicker-delay': 'fireFlicker 0.6s ease-in-out infinite alternate 0.2s',
      },
      keyframes: {
        fireFlicker: {
          '0%': { transform: 'scaleY(1) translateY(0)', opacity: '0.6' },
          '50%': { transform: 'scaleY(1.2) translateY(-4px)', opacity: '0.8' },
          '100%': { transform: 'scaleY(0.9) translateY(-2px)', opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}

