import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import babel from '@rollup/plugin-babel';
import dts from 'vite-plugin-dts';

export default defineConfig({
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
  build: {
    minify: false,
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'vue-yandex-maps',
    },
    rollupOptions: {
      external: ['vue', 'vue-demi'],
      output: {
        format: 'es',
        esModule: true,
        globals: {
          vue: 'vue',
          'vue-demi': 'vueDemi',
        },
      },
    },
  },
  plugins: [
    vue(),
    dts(),
    babel({
      babelHelpers: 'runtime',
      exclude: '**/node_modules/**',
      sourceType: 'unambiguous',
    }),
  ],
});
