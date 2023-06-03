import { createApp } from 'vue';
import { createYmaps } from 'vue-yandex-maps';
import App from './App.vue';

const app = createApp(App);

const ymaps = createYmaps({
  apikey: '9fa90fbc-ce5f-4dc9-ae6d-433e0ec7338b',
});

app.use(ymaps);
app.mount('#app');
