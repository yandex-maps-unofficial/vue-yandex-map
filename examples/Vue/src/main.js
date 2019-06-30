import Vue from 'vue'
import App from './App.vue'
import ymapPlugin from '../../../dist/vue-yandex-maps';

Vue.config.productionTip = false
Vue.use(ymapPlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')
