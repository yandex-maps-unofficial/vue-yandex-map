//import YMapLoad from './YMapLoad';
import YMapPlugin from './YMapPlugin';
import Marker from './Marker';
import { yMapLoad } from './utils';

const install = function(Vue, options = {}) {
  Vue.prototype.$yMapLoad = Vue.yMapLoad = yMapLoad;
  YMapPlugin.pluginOptions = options
  Vue.component('yandex-map', YMapPlugin);
  Vue.component('ymap-marker', Marker);
};

YMapPlugin.install = install;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(YMapPlugin)
}

export const yandexMap = YMapPlugin;
export const ymapMarker = Marker;
export const ymapLoad = yMapLoad;

export default YMapPlugin;
