import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'vue-yandex-maps',
      file: pkg.module,
      format: 'es',
      exports: 'named',
      globals: { vue: 'vue' },
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      terser(),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      name: 'vue-yandex-maps',
      file: pkg.main,
      format: 'umd',
      exports: 'named',
      globals: { vue: 'vue' },
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      uglify(),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      name: 'vue-yandex-maps',
      file: pkg.unpkg,
      format: 'iife',
      exports: 'named',
      extend: true,
      globals: { vue: 'vue' },
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      uglify(),
    ],
  },
];
