import type { App, Vue2 } from 'vue-demi';
import { VueYandexMaps } from '../..';
import { createYmapsOptions } from '../maps';

export function createYmaps(settings: VueYandexMaps.PluginSettings) {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    install(app: App) {
      createYmapsOptions(settings);
    },
  };
}

export function createYmapsVue2(settings: VueYandexMaps.PluginSettings) {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    install(Vue: typeof Vue2) {
      createYmapsOptions(settings);
    },
  };
}
