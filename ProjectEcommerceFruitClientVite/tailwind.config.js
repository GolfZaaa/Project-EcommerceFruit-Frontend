/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        'custom-size' : '265px',
      },
      margin: {
        'custom-marginleft' : '35px',
      },
      height: {
        '15': '15px', 
      },
      padding: {
        '23': '23px', 
        '22': '22px', 
      },
    },
  },
  plugins: [],
};
