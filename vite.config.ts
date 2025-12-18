import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Icon-Tag-Batcher/', // ⭐ 一定要跟 repo 名一樣
  plugins: [react()],
})
