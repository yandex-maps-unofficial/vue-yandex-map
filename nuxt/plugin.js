import Vue from 'vue';
import YmapPlugin from 'vue-yandex-maps';

Vue.use(YmapPlugin, <%= serialize(options) %>);
