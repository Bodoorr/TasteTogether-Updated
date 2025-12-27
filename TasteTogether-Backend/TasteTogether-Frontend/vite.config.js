import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true
    })
  ],

  define: {
    global: 'window'
  },

  resolve: {
    alias: {
      stream: 'stream-browserify',
      util: 'util',
      events: 'events',
      process: 'process/browser',
      buffer: 'buffer'
    }
  },

  optimizeDeps: {
    include: [
      'simple-peer',
      'randombytes',
      'buffer',
      'process',
      'stream-browserify',
      'util',
      'events'
    ]
  }
})
