import { defineNuxtConfig } from '@nuxt/bridge';

export default defineNuxtConfig({
  bridge: {
    vite: true,
  },

  vite: {
    resolve: {
      preserveSymlinks: true,
    },
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt2',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: '',
      },
      {
        name: 'format-detection',
        content: 'telephone=no',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
    ],
  },

  rootDir: __dirname,

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  modules: ['vue-yandex-maps/nuxt'],

  yandexMaps: {
    apikey: '9fa90fbc-ce5f-4dc9-ae6d-433e0ec7338b',
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // @ts-ignore
    transpile: ['unhead', 'vue-yandex-maps'],
  },
});
