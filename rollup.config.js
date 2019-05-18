import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";
import { uglify } from 'rollup-plugin-uglify';

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'vue-yandex-maps',
      file: pkg.main,
      format: 'es',
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      terser()
    ]
  },
  {
    input: 'src/index.js',
    output: {
      name: 'vue-yandex-maps',
      file: pkg.unpkg, 
      format: 'umd'
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      uglify()
    ]
  },
];
