import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
<<<<<<< Updated upstream
        target: 'http://localhost:5001',
=======
        target: 'http://localhost:3001',
>>>>>>> Stashed changes
        changeOrigin: true,
        secure: false
      }
    }
  },
}); 