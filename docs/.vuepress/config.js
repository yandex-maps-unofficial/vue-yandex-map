module.exports = {
  title: 'Vue-yandex-maps',
  description: 'Я.Карты для Vue JS',
  themeConfig: {
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
  locales: {
    '/': {
      lang: 'ru-RU',
      title: 'Русский'
      // description: ''
    },
    '/en/': {
      lang: 'en-US',
      title: 'English'
      // description: ''
    }
  }
}
