module.exports = {
  themeConfig: {
    locales: {
      '/': {
        title: 'Vue-yandex-maps',
        description: 'Я.Карты для Vue JS',
        nav: [
          { text: 'Главная', link: '/' },
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
        title: 'Vue-yandex-maps',
        description: 'Yandex map component for Vue JS',
        nav: [
          { text: 'Main', link: '/en/' },
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
      title: 'Русский',
      description: 'Документация на русском языке'
    },
    '/en/': {
      lang: 'en-US',
      title: 'English',
      description: 'Documentation on english language'
    }
  }
}
