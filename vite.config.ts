import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { name } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: `/${name}/`,
  build: {
    outDir: `../dist/${name}`,
  },
})
