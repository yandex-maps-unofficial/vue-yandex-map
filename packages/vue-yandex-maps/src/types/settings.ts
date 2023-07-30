import { Ref } from 'vue';
import { OverloadParameters } from './overload-extract';
import { safeRef } from '../composables/utils';

export namespace VueYandexMaps {
    export const settings: Ref<VueYandexMaps.PluginSettings> = safeRef({
      apikey: '',
    });

    // Type-safe ymaps3 to avoid "never" problems with undefined checks
    export const ymaps = () => ymaps3;

    export const loaded = safeRef(false);

    export interface PluginSettings {
        /**
         * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/load.html#parms
         * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/load.html#parms
         */
        apikey: string
        /**
         * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/load.html#parms
         * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/load.html#parms
         * @default ru_RU
         */
        lang?: string
        /**
         * @default 3.0
         */
        version?: string
        /**
         * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/general.html#strict-mode
         * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/general.html#strict-mode
         * @default false
         */
        strictMode?: boolean
        /**
         * @description You can choose where to initialize Yandex Maps library
         *
         * - onPluginInit will load maps as soon as you call createYmapsOptions (on Client Side only)
         * - onComponentMount will load maps as soon as you load component (lazy option, default)
         * - never will require you to call initYmaps by yourself
         *
         * @default onComponentMount
         */
        initializeOn?: 'onPluginInit' | 'onComponentMount' | 'never'
        /**
         * @description You can preload modules in initYmaps, note you will still have to import them later to use
         * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/ref/modules/index.html
         * @see https://yandex.com/dev/maps/jsapi/doc/3.0/ref/modules/index.html
         */
        importModules?: OverloadParameters<typeof ymaps3['import']>[0][]
    }

    /**
     * @description Strict-typed version of PluginSettings with all keys required
     */
    export type DefProductSettings = {
        [T in keyof PluginSettings]-?: PluginSettings[T]
    }
}
