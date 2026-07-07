import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../LEARNING ASPNET SUMMER SERIOUS/GymManagementSystem/wwwroot',
    emptyOutDir: true
  }
})