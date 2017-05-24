import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: './src/index.js',
  dest: 'vue-yandex-maps.js',
  plugins: [
    vue({compileTemplate: true}),
    buble(),
    uglify()
  ],
  format: 'umd',
  moduleName: 'vueYandexMaps'
};
