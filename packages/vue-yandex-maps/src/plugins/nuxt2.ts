import { join } from 'path';
import { Module } from '@nuxt/types';
import { VueYandexMaps } from '..';

const nuxt2Module: Module<VueYandexMaps.PluginSettings> = function init(moduleOptions) {
  if (!this.nuxt.options.build) this.nuxt.options.build = {};
  if (!this.nuxt.options.build.transpile) this.nuxt.options.build.transpile = [];
  this.nuxt.options.build.transpile.push('vue-yandex-maps');

  moduleOptions = this.nuxt.options.yandexMaps || moduleOptions;

  this.addPlugin({
    src: join(__dirname, 'nuxt2-plugin.js'),
    fileName: 'vue-yandex-maps.js',
    options: moduleOptions,
  });
};

export default nuxt2Module;
