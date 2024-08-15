/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        flip: {
          "0%, 100%": { transform: "rotateY(0)" },
          "50%": { transform: "rotateY(180deg)" },
        },
      },
      animation: {
        flip: "flip 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};

// module.exports = {
//   darkMode: 'class', // or 'media' for system preference
//   // Rest of the configuration
// };
