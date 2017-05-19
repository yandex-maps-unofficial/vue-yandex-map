import YMap from './YMap.vue'

const MyPlugin = {
    install(Vue, options) {
        Vue.component('yandex-map', YMap);
    }
};

export default MyPlugin;