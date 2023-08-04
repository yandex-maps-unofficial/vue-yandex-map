// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['vue-yandex-maps/nuxt'],
  yandexMaps: {
    apikey: '9fa90fbc-ce5f-4dc9-ae6d-433e0ec7338b',
  },
  // Needed for local testing only
  // https://github.com/nuxt/nuxt/issues/20001
  vite: {
    resolve: {
      preserveSymlinks: true,
    },
  },
});
