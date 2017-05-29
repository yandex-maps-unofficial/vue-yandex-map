import YMapPlugin from './YMap.vue';
import Marker from './Marker.vue';

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

if (window.Vue) {
  window.YMapPlugin = YMapPlugin;
  Vue.use(install); // eslint-disable-line
}

YMapPlugin.install = install;
export default YMapPlugin;
