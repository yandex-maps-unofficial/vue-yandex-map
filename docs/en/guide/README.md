# Introduction

You can easily plug Yandex map in your project with this custom component and you available minimal part of functionality right now from the "box". However If you want to use full functionality of [YandexMap API](https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/), you need apply to [map instance](https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/) directly.
 

##  Installing

Using npm

```Bash
npm install vue-yandex-maps
```

Using yarn
```Bash
yarn add vue-yandex-maps
```

After that you can define settings of component:
 [API key](https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/load-docpage/), [language](https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/localization-docpage/), [procedure of assignment geographic coords](https://tech.yandex.ru/maps/jsapi/doc/2.1/dg/concepts/load-docpage/#load__coordorder) and Yandex map version. These settings are optional and below you can see default options:

```JavaScript
const settings = {
  apiKey: '',
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1'
}
```

At this moment you can use these settings when you will be registration the component.

## Registration

### Global
```JavaScript
import YmapPlugin from 'vue-yandex-maps'

Vue.use(YmapPlugin, settings)
```

### Local

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

Add `vue-yandex-maps/nuxt` in modules section `nuxt.config.js`

```JavaScript
{
  modules: [
    ['vue-yandex-maps/nuxt', settings]
  ]
}
```

### Ymaps Loader

If you need to use global variable `ymaps` separately from map component (e.g. for geocoder), just import loader. You may to define settings (see above) and `debug` option (`false` by default).

```JavaScript
import { loadYmap } from 'vue-yandex-maps'

export default {
  mounted() {
    loadYmap({ ...settings, debug: true });
  }
}
```

### CDN

You can use plugin directly via link [https://unpkg.com/vue-yandex-maps](https://unpkg.com/vue-yandex-maps). The plugin will be install automatically if you use Vue JS. It could be useful when you use [Code Pen](https://codepen.io/PNKBizz/pen/WMRwyM)
