import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';

export default {
  entry: './src/index.js',
  dest: 'vue-yandex-maps.js',
  plugins: [
    vue({compileTemplate: true}),
    buble()
  ],
  format: 'umd',
  moduleName: 'vueYandexMaps'
};
