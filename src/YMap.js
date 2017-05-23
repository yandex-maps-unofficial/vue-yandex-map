import YMap from './YMap.vue'

const YMapPlugin = {
    install(Vue, options) {
        Vue.component('yandex-map', YMap);
        Vue.prototype.$ymapEventBus = new Vue({
            data: {
                ymapReady: false,
                scriptIsNotAttached: true
            }
        });
        if (typeof window !== 'undefined' && window.Vue) {
            window.Vue.use(YMapPlugin)
        }

    }
};

export default YMapPlugin;