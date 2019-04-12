import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'vue-yandex-maps',
      file: pkg.main,
      format: 'umd',
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      uglify()
    ]
  },

  {
    input: 'src/index.js',
    output: [
      { file: pkg.module, format: 'es' },
    ],
  },
];
