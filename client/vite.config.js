import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,       // Cela est nécessaire si tu ne travailles pas avec HTTPS
      },
    },
  },
  plugins: [react()],
});