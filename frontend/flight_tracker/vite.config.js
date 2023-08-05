import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
      host: '0.0.0.0', 
      port: 3000,
      proxy: {
        '/': {
          target: `https://${import.meta.env.VITE_LIGHTSAIL_IP}:8000`,
          changeOrigin: true,
        },
      },
    },
  });  