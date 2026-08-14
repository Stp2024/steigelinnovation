import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    sourcemap: false,
    // Inline small assets to reduce HTTP requests
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Fine-grained code splitting to defer non-critical JS
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Framer Motion — load separately (big, lazy pages need it)
            if (id.includes('framer-motion')) return 'vendor-framer';
            // Router
            if (
              id.includes('react-router-dom') ||
              id.includes('react-router') ||
              id.includes('@remix-run')
            ) return 'vendor-router';
            // Icons
            if (id.includes('lucide-react')) return 'vendor-lucide';
            // Lenis — small, keep in core
            if (id.includes('lenis')) return 'vendor-core';
            // React + ReactDOM core
            if (id.includes('react-dom') || id.includes('/react/')) return 'vendor-react';
            // Everything else
            return 'vendor-core';
          }
        }
      }
    }
  }
})
