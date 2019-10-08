import Vue from 'vue'
import App from './App.vue'
import ymapPlugin from '../../../dist/vue-yandex-maps';
import { ymapLoad } from '../../../dist/vue-yandex-maps';

/*ymapLoad.yMapLoad()
  .then(ymap => {
    console.log(ymap)
  })
console.log(ymapLoad)
console.log(ymapLoad.yMapLoad())*/

Vue.config.productionTip = false
Vue.use(ymapPlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')
