import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';
import { VueYandexMaps } from 'vue-yandex-maps';

// Module options TypeScript interface definition
export interface ModuleOptions extends VueYandexMaps.PluginSettings {
}

export interface ModulePublicRuntimeConfig {
  yandexMaps: VueYandexMaps.PluginSettings;
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
    if (!nuxt.options.runtimeConfig) {
      nuxt.options.runtimeConfig = {
        // @ts-ignore
        app: {},
        // @ts-ignore
        public: {},
      };
    }

    // @ts-ignore
    if (!nuxt.options.runtimeConfig.public) nuxt.options.runtimeConfig.public = {};

    nuxt.options.runtimeConfig.public.yandexMaps = options;

    if (!nuxt.options.build.transpile) nuxt.options.build.transpile = [];
    nuxt.options.build.transpile.push('vue-yandex-maps');

    addPlugin({
      src: createResolver(import.meta.url)
        .resolve('./runtime/plugin'),
    });
  },
});
