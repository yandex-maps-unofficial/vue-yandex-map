# Введение

Компонент позволяет без усилий подключить Я.Карты в проект и дает необходимый минимум функционала "из коробки". Однако, вы можете пользоваться всей мощью API Я.Карт, обращаясь напрямую к [инстансу карты](/).  

## Подключение

Подключите компонент, используя ваш пакетный менеджер

```Bash
npm install vue-yandex-maps
```

После этого вы можете определить настройки подключения компонента: [индивидуальный ключ АПИ](https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/load-docpage/), [используемый язык](https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/localization-docpage/) и версия Я.Карт. Эти настройки являются опциональными, значения по умолчанию указаны ниже.

```JavaScript
const settings = {
  apiKey: '',
  lang: 'ru_RU',
  version: '2.1'
}
```

Теперь вы можете использовать эти настройки при регистрации вашего компонента.

## Регистрация компонента

### Глобальная

```JavaScript
import YmapPlugin from 'vue-yandex-maps'

Vue.use(YmapPlugin, settings)
```

### Локальная

```JavaScript
import { yandexMap, ymapMarker } from 'vue-yandex-maps'

export default {
  components: { yandexMap, ymapMarker }
  // other options
}

```
```HTML
<yandex-map :settings="settings">
    <!--Markers-->
</yandex-map>
```

### Nuxt module

Добавьте `vue-yandex-maps/nuxt` в секцию модулей файла `nuxt.config.js`

```JavaScript
{
  modules: [
    ['vue-yandex-maps/nuxt', settings]
  ]
}
```

### CDN

Вы можете подключить плагин напрямую, используя ссылку [https://unpkg.com/vue-yandex-maps](https://unpkg.com/vue-yandex-maps). Установка будет произведена автоматически при обнаружении Vue JS. Это может быть полезно при использовании [Code Pen](https://codepen.io/PNKBizz/pen/WMRwyM)