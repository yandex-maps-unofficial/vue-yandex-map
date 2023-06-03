import Vue from 'vue';
import App from './App.vue';
import ymapPlugin from '../../../src';

Vue.config.productionTip = false;
Vue.use(ymapPlugin);

new Vue({
  render: h => h(App),
}).$mount('#app');
