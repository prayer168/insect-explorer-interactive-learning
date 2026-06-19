import { defineConfig } from 'vite'

// 使用相對路徑 './'，讓教材在 GitHub Pages 子路徑下也能正常運作。
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
