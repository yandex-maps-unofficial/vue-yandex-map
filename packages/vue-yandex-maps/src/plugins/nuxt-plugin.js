import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';
import { createYmapsOptions } from 'vue-yandex-maps';

export default defineNuxtPlugin(() => {
  createYmapsOptions(useRuntimeConfig().public.yandexMaps);
});
