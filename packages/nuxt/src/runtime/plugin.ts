import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { createYmapsOptions } from 'vue-yandex-maps';

export default defineNuxtPlugin(() => {
  createYmapsOptions(useRuntimeConfig().public.yandexMaps);
});
