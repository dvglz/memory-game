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
    },
  },
  plugins: [],
}

