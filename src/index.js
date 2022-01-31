import YMapPlugin from './YMap';
import Marker from './Marker';
import { setupBalloonClass, ymapLoader } from './utils';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  if (+Vue.version[0] === 3) {
    console.warn('Vue-yandex-maps: This version is only compatible with Vue 2.X. Please install vue-yandex-maps@next');
    return;
  }
  install.installed = true;
  setupBalloonClass(Vue);
  YMapPlugin.pluginOptions = options;
  Vue.component('yandex-map', YMapPlugin);
  Vue.component('ymap-marker', Marker);
};

YMapPlugin.install = install;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(YMapPlugin);
}

export const loadYmap = ymapLoader;
export const yandexMap = YMapPlugin;
export const ymapMarker = Marker;

export default YMapPlugin;
