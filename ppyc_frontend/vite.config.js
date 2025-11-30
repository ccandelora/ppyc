import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'
import { existsSync, copyFileSync, unlinkSync } from 'fs'

// Define __dirname for ES modules
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Simple, performance-focused Vite config
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    // Custom plugin to rename index.prod.html to index.html after build
    {
      name: 'rename-index-html',
      closeBundle() {
        if (command === 'build') {
          const distPath = resolve(__dirname, 'dist');
          const prodHtml = resolve(distPath, 'index.prod.html');
          const indexHtml = resolve(distPath, 'index.html');
          if (existsSync(prodHtml)) {
            copyFileSync(prodHtml, indexHtml);
            unlinkSync(prodHtml);
          }
        }
      }
    }
  ],
  
  build: {
    // Output directory
    outDir: 'dist',
    
    // Use production template
    rollupOptions: {
      input: command === 'serve' 
        ? resolve(__dirname, 'index.html')
        : resolve(__dirname, 'index.prod.html'),
      output: {
        manualChunks: {
          // Only essential chunks
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          vendor: ['axios', 'date-fns']
        }
      }
    },
    
    // Fast minification
    minify: 'esbuild',
    
    // Modern target
    target: 'es2020',
    
    // Don't report compressed size (faster builds)
    reportCompressedSize: false,
    
    // Basic CSS splitting
    cssCodeSplit: true,
  },
  
  // Development server
  server: {
    port: 5173,
    host: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  
  // Basic resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  },
  
  // Simple optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      '@tinymce/tinymce-react'
    ]
  }
}))
