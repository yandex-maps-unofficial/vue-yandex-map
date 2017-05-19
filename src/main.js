import Vue from 'vue'
import App from './App.vue'
import MyPlugin from './YMap'

Vue.use(MyPlugin);

new Vue({
  el: '#app',
  render: h => h(App)
})
