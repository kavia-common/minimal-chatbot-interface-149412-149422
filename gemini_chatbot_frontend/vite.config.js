import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
// Vite configuration for the Gemini Chatbot frontend.
// - Binds dev server to 0.0.0.0 and port 3000 for preview systems
// - Allows the preview domain so origin checks pass
// - Adds a dev proxy for '/chat' -> 'http://localhost:3001' to avoid CORS in development
const PREVIEW_ALLOWED_HOST = 'vscode-internal-33666-beta.beta01.cloud.kavia.ai'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 0.0.0.0
    port: 3000,
    allowedHosts: [PREVIEW_ALLOWED_HOST],
    proxy: {
      // Map '^/chat' (prefix) to backend without rewriting.
      '/chat': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        // Keep the path as-is; no rewrite to a different subpath
        rewrite: (path) => path,
      },
    },
  },
  preview: {
    host: true,
    port: 3000,
    allowedHosts: [PREVIEW_ALLOWED_HOST],
  },
})
