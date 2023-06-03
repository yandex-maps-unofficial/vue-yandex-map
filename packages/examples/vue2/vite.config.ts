import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
// import { createVuePlugin as vue } from 'vite-plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
})