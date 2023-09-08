import YMapPlugin from './YMap';
import Marker from './Marker';
import { setupBalloonClass, ymapLoader } from './utils';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;
  setupBalloonClass(Vue);
  YMapPlugin.pluginOptions = options;
  Vue.component('yandex-map', YMapPlugin);
  Vue.component('ymap-marker', Marker);
};

YMapPlugin.install = install;

export const loadYmap = ymapLoader;
export const yandexMap = YMapPlugin;
export const ymapMarker = Marker;

export default YMapPlugin;
