module.exports = {
  themeConfig: {
    repo: 'PNKBizz/vue-yandex-map',
    docsDir: 'docs',
    editLinks: true,
    locales: {
      '/': {
        selectText: 'Язык',
        title: 'Vue-yandex-maps',
        description: 'Я.Карты для Vue JS',
        nav: [
          { text: 'v0.x', items: [{ text: 'v1.x', link: 'https://vue-yandex-maps.github.io/new-docs/' }, { text: 'v2.x', link: 'https://yandex-maps-unofficial.github.io/vue-yandex-maps/' }] },
          { text: 'Руководство', link: '/guide/' },
          { text: 'Примеры', link: '/examples/' },
          { text: 'API Я.Карт', link: 'https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/' },
        ],
        sidebar: {
          '/guide/': [
            '',
            'Map',
            'Marker'
          ]
        }
      },
      '/en/': {
        selectText: 'Language',
        title: 'Vue-yandex-maps',
        description: 'Yandex map component for Vue JS',
        nav: [
          { text: 'v0.x', items: [{ text: 'v1.x', link: 'https://vue-yandex-maps.github.io/new-docs/' }, { text: 'v2.x', link: 'https://yandex-maps-unofficial.github.io/vue-yandex-maps/' }] },
          { text: 'Guide', link: '/en/guide/' },
          { text: 'Examples', link: '/en/examples/' },
          { text: 'YandexMap API ', link: 'https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/' },
        ],
        sidebar: {
          '/en/guide/': [
            '',
            'Map',
            'Marker'
          ]
        }
      }
    }
  },
  locales: {
    '/': {
      lang: 'ru-RU',
      title: 'Vue-yandex-maps',
      description: 'Документация на русском'
    },
    '/en/': {
      lang: 'en-US',
      title: 'Vue-yandex-maps',
      description: 'Documentation on english'
    }
  }
}
