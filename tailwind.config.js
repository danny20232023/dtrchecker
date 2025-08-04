/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/dtr-checker-frontend/src/**/*.{js,jsx,ts,tsx}', // Add this line for your React components
  ],
  theme: {
    extend: {
        fontFamily: {
            sans: ['Figtree', 'Inter', 'sans-serif'], // Add Inter to your font stack
        },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
