import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: './src/index.js',
  dest: 'vue-yandex-maps.js',
  plugins: [
    resolve(),
    vue({compileTemplate: true}),
    buble(),
    uglify()
  ],
  format: 'umd',
  moduleName: 'vueYandexMaps'
};
