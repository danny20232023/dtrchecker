import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'; // Import the React plugin

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/dtr-checker-frontend/src/index.js', // Point to your React app's entry
            refresh: true,
        }),
        react(), // Add the React plugin
    ],
    // Ensure that Vite's server can handle requests from your Laravel development server
    server: {
        host: 'localhost',
        port: 5173, // Default Vite port
        hmr: {
            host: 'localhost',
        },
    },
});
