import { addPlugin, defineNuxtModule } from '@nuxt/kit';
import { defu } from 'defu';
import type { VueYandexMaps } from '../../../types/settings';

export interface ModuleOptions extends VueYandexMaps.PluginSettings {
}

export interface ModulePublicRuntimeConfig {
  yandexMaps: VueYandexMaps.PluginSettings
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'vue-yandex-maps',
    configKey: 'yandexMaps',
    compatibility: {
      bridge: true,
    },
  },
  setup(options, nuxt) {
    nuxt.options.runtimeConfig.public.yandexMaps = defu(options);

    addPlugin({
      src: 'vue-yandex-maps/nuxt-plugin',
    });
  },
});
