import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  preview: {
    allowedHosts: [
      'wingonew-production.up.railway.app',
      '.railway.app',
    ],
  },
  server: {
    host: true,
    strictPort: false,
  },
})
