import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Exclude the backend folder so Vite doesn't try to watch best.pt
      ignored: ['**/backend/**']
    },
    // In local dev, proxy backend API calls so you don't need CORS or a separate port
    proxy: {
      '/detect': 'http://127.0.0.1:8000',
      '/api': 'http://127.0.0.1:8000',
    }
  },
  build: {
    outDir: 'dist',
  }
})
