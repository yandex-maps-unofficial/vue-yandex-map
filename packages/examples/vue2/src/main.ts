import Vue from 'vue';
import { createYmapsVue2 } from 'vue-yandex-maps';
import App from './App.vue';

Vue.config.productionTip = false;

const ymaps = createYmapsVue2({
  apikey: '9fa90fbc-ce5f-4dc9-ae6d-433e0ec7338b',
});

Vue.use(ymaps);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
