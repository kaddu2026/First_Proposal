import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes every asset URL relative, so the build works on ANY GitHub Pages
// address (https://<user>.github.io/<repo>/ or a custom domain) without editing anything.
// If you ever prefer an absolute path, run:  VITE_BASE=/your-repo-name/ npm run build
export default defineConfig({
  base: process.env.VITE_BASE || './',
  plugins: [react()],
  build: {
    target: 'es2019',
    cssCodeSplit: false,
    chunkSizeWarningLimit: 300,
  },
})
