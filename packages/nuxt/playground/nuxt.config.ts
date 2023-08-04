export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  yandexMaps: {
    apikey: '',
  },
  typescript: {
    strict: true,
    shim: true,
    typeCheck: true,
  },

  //Needed for local testing only
  //https://github.com/nuxt/nuxt/issues/20001
  vite: {
    resolve: {
      preserveSymlinks: true,
    },
  },
});
