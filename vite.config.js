import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Essential for Vite to understand and compile React JSX
  // You can add other configurations here if needed, for example:
  // server: {
  //   port: 3000, // Change the development server port
  // },
  // build: {
  //   outDir: 'dist', // Specify the output directory for production build
  // },
});
