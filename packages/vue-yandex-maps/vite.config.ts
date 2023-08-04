import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import babel from '@rollup/plugin-babel';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  optimizeDeps: {
    exclude: ['vue', 'vue-demi'],
  },
  build: {
    minify: false,
    sourcemap: true,
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', 'vue-demi', 'path'],
      input: {
        'vue-yandex-maps': resolve(__dirname, 'src/index.ts'),
        nuxt2: resolve(__dirname, 'src/plugins/nuxt2'),
      },
      output: {
        format: 'es',
        esModule: true,
        globals: {
          vue: 'Vue',
          'vue-demi': 'VueDemi',
        },
        entryFileNames: '[name].js',
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
    viteStaticCopy({
      targets: [
        {
          src: 'src/plugins/nuxt2-plugin.js',
          dest: '',
        },
        {
          src: 'src/plugins/nuxt-plugin.js',
          dest: '',
        },
        {
          src: '../nuxt/dist',
          rename: 'nuxt',
          dest: '',
        },
      ],
    }),
  ],
});
