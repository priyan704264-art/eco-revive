import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Exclude the backend folder so Vite doesn't try to watch best.pt
      ignored: ['**/backend/**']
    }
  }
})
