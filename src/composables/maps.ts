import { watch } from 'vue-demi';
import { VueYandexMaps } from '../types/settings';

const allowedOptionsKeys: Record<keyof VueYandexMaps.PluginSettings, true> = {
  apikey: true,
  lang: true,
  initializeOn: true,
  importModules: true,
  version: true,
  strictMode: true,
};

export function initYmaps() {
  return new Promise<void>((res, rej) => {
    if (typeof ymaps3 !== 'undefined') return res();
    if (typeof window === 'undefined') return rej(new Error('You must call initYmaps on Client Side only'));

    if (document.getElementById('vue-yandex-maps')) {
      const watcher = watch(VueYandexMaps.loaded, (val) => {
        if (val) {
          // Stopping watcher
          watcher();
          res();
        }
      }, {
        immediate: true,
      });
      return;
    }

    const settings = VueYandexMaps.settings.value;

    const yandexMapScript = document.createElement('SCRIPT');
    const url = new URL(`https://api-maps.yandex.ru/${settings.version}/`);
    url.searchParams.set('lang', settings.lang || 'ru_RU');
    url.searchParams.set('apikey', settings.apikey);

    yandexMapScript.setAttribute('src', url.toString());
    yandexMapScript.setAttribute('async', '');
    yandexMapScript.setAttribute('defer', '');
    yandexMapScript.setAttribute('type', 'text/javascript');
    yandexMapScript.setAttribute('id', 'vue-yandex-maps');
    document.head.appendChild(yandexMapScript);
    yandexMapScript.onload = async () => {
      try {
        await VueYandexMaps.ymaps().ready;

        // @ts-expect-error Yandex forgot to specify strictMode in types
        if (settings.strictMode) VueYandexMaps.ymaps().strictMode = true;

        if (settings.importModules) {
          await Promise.all(
            settings.importModules.map(
              (module) => VueYandexMaps.ymaps().import(module as any),
            ),
          );
        }

        VueYandexMaps.loaded.value = true;
        res();
      } catch (e) {
        rej(e);
      }
    };
    yandexMapScript.onerror = rej;
  });
}

export function createYmapsOptions(options: VueYandexMaps.PluginSettings): VueYandexMaps.PluginSettings {
  // Using DefProductSettings to ensure all non-required fields will always have default value
  const optionsShallowClone: VueYandexMaps.DefProductSettings = {
    lang: 'ru_RU',
    initializeOn: 'onComponentMount',
    importModules: [],
    version: '3.0',
    strictMode: false,
    ...options,
  };
  if (!optionsShallowClone.apikey) throw new Error('You must specify apikey for createYmapsOptions');

  const notAllowedKeys = Object.keys(optionsShallowClone).filter((key) => !(key in allowedOptionsKeys));
  if (notAllowedKeys.length) throw new Error(`You have passed unknown keys to createYmapsOptions: ${notAllowedKeys.join(', ')}. Only ${Object.keys(allowedOptionsKeys).join(', ')} are allowed.`);

  VueYandexMaps.settings.value = optionsShallowClone;

  return optionsShallowClone;
}
