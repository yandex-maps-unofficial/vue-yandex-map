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
* [API key](https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/load-docpage/)
* [Language](https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/localization-docpage/)
* [Procedure of assignment geographic coords](https://tech.yandex.ru/maps/jsapi/doc/2.1/dg/concepts/load-docpage/#load__coordorder)
* [Yandex Maps for Business usage](https://yandex.com/dev/maps/commercial/)
* Yandex map version

These settings are optional and below you can see default options:

```JavaScript
const settings = {
  apiKey: '',
  lang: 'ru_RU',
  coordorder: 'latlong',
  enterprise: false,
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

Add file `ymapPlugin.js` into `plugins` directory. 

```JavaScript
import Vue from 'vue'
import YmapPlugin from 'vue-yandex-maps'

const settings = { ... } // plugin settings

Vue.use(YmapPlugin, settings);
```

Add existed plugin in plugin section `nuxt.config.js`

```JavaScript
{
  plugins: [
    { src: '~/plugins/ymapPlugin.js',  mode: 'client' }
  ]
}
```

### Ymaps Loader

If you need to use global variable `ymaps` separately from map component (e.g. for geocoder), just import loader. You may to define settings (see above) and `debug` option (`false` by default). Note that loader function is asynchronous.  

```JavaScript
import { loadYmap } from 'vue-yandex-maps'

export default {
  async mounted() {
    await loadYmap({ ...settings, debug: true });
    // here you may use ymaps 
  }
}
```

### CDN

You can use plugin directly via link [https://unpkg.com/vue-yandex-maps](https://unpkg.com/vue-yandex-maps). The plugin will be install automatically if you use Vue JS. It could be useful when you use [Code Pen](https://codepen.io/PNKBizz/pen/WMRwyM)
