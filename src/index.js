import YMapPlugin from './YMap';
import Marker from './Marker';

const install = function(Vue) {
  Vue.component('yandex-map', YMapPlugin);
  Vue.component('ymap-marker', Marker);
  Vue.prototype.$ymapEventBus = new Vue({
      data: {
          ymapReady: false,
          scriptIsNotAttached: true
      }
  });
};

YMapPlugin.install = install;

export const yandexMap = YMapPlugin;
export const ymapMarker = Marker;

export default YMapPlugin;