import vue from 'rollup-plugin-vue';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
  input: './src/index.js',
  output: {
    exports: 'named',
    file: 'vue-yandex-maps.js',
    format: 'umd',
    name: 'vueYandexMaps'
  },
  plugins: [
    resolve(),
    vue({compileTemplate: true}),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    }),
    uglify()
  ]
};
