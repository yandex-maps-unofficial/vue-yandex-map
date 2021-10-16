import { createApp } from 'vue'
import App from './App.vue'
import ymapPlugin from '../../../dist/vue-yandex-maps.esm.js';

const app = createApp(App)

app.use(ymapPlugin)
app.mount('#app')
