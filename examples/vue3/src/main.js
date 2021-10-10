import { createApp } from 'vue'
import App from './App.vue'
import ymapPlugin from '../../../src';

const app = createApp(App)

app.use(ymapPlugin)
app.mount('#app')
