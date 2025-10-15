import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
// Vite configuration for the Gemini Chatbot frontend.
// - Binds dev server to 0.0.0.0 and port 3000 for preview systems
// - Mirrors same host/port for preview
// - Keeps defaults otherwise
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // 0.0.0.0
    port: 3000
  },
  preview: {
    host: true,
    port: 3000
  }
})
