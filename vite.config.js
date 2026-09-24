import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Smart Fitout uses a custom domain, so root-relative asset URLs are reliable
  // on both the homepage and direct SPA routes such as /book and /admin.
  base: '/'
})
