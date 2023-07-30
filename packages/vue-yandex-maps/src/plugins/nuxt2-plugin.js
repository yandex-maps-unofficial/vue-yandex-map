import { createYmapsOptions } from 'vue-yandex-maps';

const vueYandexMapsPlugin = (context) => {
  createYmapsOptions(<%= JSON.stringify(options, null, 2) %>);
}

export default vueYandexMapsPlugin