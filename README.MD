# vue-yandex-maps

vue-yandex-maps is a plugin for vue.js that adds yandex-map custom element.

# Install

```Bash
npm install vue-yandex-maps --save
```

### CommonJS

You can use any build tool which supports `commonjs`:

```JavaScript
// register globally
var yandexMap =  require('vue-yandex-maps');
Vue.use(yandexMap)

// or for a single instance
var yandexMap = require('vue-yandex-maps');
new Vue({
  components: {yandexMap}
})

```

Or in ES2015:

```JavaScript
// register globally
import yandexMap from 'vue-yandex-maps'
Vue.use(yandexMap)

// or for a single instance
import yandexMap from 'vue-yandex-maps'
new Vue({
  components: {yandexMap}
})

```

### Direct include

You can use the CDN: https://unpkg.com/vue-yandex-maps, `yandexMap` is exposed to `window` and will automatically install itself. Also you can use your local copy:

```HTML
<script src="../node_modules/vue-yandex-maps/vue-yandex-maps.js"></script>
```

## Usage

Use <yandex-map> tag to enable the map instance, and use attributes to define map options.

```HTML
<yandex-map :latitude=54.62896654088406
            :longtitude=39.731893822753904
            hint-content="Hint content 1"
            balloon-content="Balloon content 1"></yandex-map>
```

# Options

| Option | Type | Description |
| ----- | ----- | ----- |
| latitude | Number | |
| longtitude | Number | |
| hint-content | String | |
| balloon-content | String | |

# License

MIT
