import YMapPlugin from './YMap';
import Marker from './Marker';
import { ymapLoader } from './utils';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;
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
