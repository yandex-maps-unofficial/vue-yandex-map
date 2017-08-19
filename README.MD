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
const YmapPlugin =  require('vue-yandex-maps');
Vue.use(YmapPlugin)

// or for a single instance
const { yandexMap, ymapMarker } = require('vue-yandex-maps');
new Vue({
  components: { yandexMap, ymapMarker }
})

```

Or in ES2015:

```JavaScript
// register globally
import YmapPlugin from 'vue-yandex-maps'
Vue.use(YmapPlugin)

// or for a single instance
import { yandexMap, ymapMarker } from 'vue-yandex-maps'
new Vue({
  components: { yandexMap, ymapMarker }
})

```

<!-- ### Direct include

You can use the CDN: https://unpkg.com/vue-yandex-maps, `yandexMap` is exposed to `window` and will automatically install itself. Also you can use your local copy:

```HTML
<script src="../node_modules/vue-yandex-maps/vue-yandex-maps.js"></script>
``` -->

## Usage

Use `<yandex-map>` tag to enable the map instance and use attributes to define map options.
Use `<ymap-marker>` tag to enable the instance of map-marker.
Type of marker in `marker-type` attribute can be:

* Placemark
* Polyline
* Rectangle
* Polygon
* Circle

```HTML
<yandex-map 
  :coords="[54.62896654088406, 39.731893822753904]"
  zoom="10"
  style="width: 600px; height: 600px;"
  :cluster-options="{
    1: {clusterDisableClickZoom: true}
  }"
  :behaviors="['ruler']"
  :controls="['trafficControl']"
  map-type="hybrid"
>

    <ymap-marker 
      marker-type="placemark"
      :coords="[54.7, 39.7]"
      hint-content="Hint content 1"
      :balloon="{header: 'header', body: 'body', footer: 'footer'}"
      :icon="{color: 'green', glyph: 'cinema'}"
      cluster-name="1"
    ></ymap-marker>

    <ymap-marker 
      marker-type="placemark"
      :coords="[54.6, 39.8]"
      hint-content="Hint content 1"
      :balloon="{header: 'header', body: 'body', footer: 'footer'}"
      :icon="{color: 'green', glyph: 'cinema'}"
      cluster-name="1"
    ></ymap-marker>

    <ymap-marker 
      marker-type="circle"
      :coords="[54.62896654088406, 39.731893822753904]"
      circle-radius="1600"
      hint-content="Hint content 1"
      :marker-fill="{color: '#000000', opacity: 0.4}"
      :marker-stroke="{color: '#ff0000', width: 5}"
      :balloon="{header: 'header', body: 'body', footer: 'footer'}"
    ></ymap-marker>

</yandex-map>
```

# Attributes

## Map attributes

| Attribute | Type | Description |
| ----- | ----- | ----- |
| coords | Array [ latitude, longtitude ] | Coordinates of map center. Required |
| zoom | Number | Zoom of map (from 0 to 19). Default value is 18. |
| cluster-options | Object | Map, where key is a name of cluster and value is an object of cluster options. [Cluster option](https://tech.yandex.ru/maps/doc/jsapi/2.0/ref/reference/Cluster-docpage/#param-options) |
| behaviors | Array | Array of enabled map behaviors. All another will be disabled. [Behaviors](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/map.behavior.Manager-docpage/#param-behaviors) |
| controls | Array | Array of enabled map controls. All another will be disabled. [Controls](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.Manager-docpage/#add-param-control) |
| map-type | String | Map type. Possible types: map, satellite, hybrid. Default value is map. |

## Marker attributes

| Attribute | Type | Description | Marker-types |
| ----- | ----- | ----- | ----- |
| marker-type | String | Type of marker ||
| coords | Array [ latitude, longtitude ] | Coordinates of point or circle center. Required | Placemark, Circle |
| coords | Array of arrays [ [latitude, longtitude], [...] ] | Coordinates of shape corners. Required | Rectangle, Polyline |
| coords | Array of two arrays of coordinates arrays (first for outer contour, second for inner) [ [[latitude, longtitude], [...]], [[...], [...]] ] | Coordinates of shape corners. Required | Polygon |
| hint-content | String | Tooltip content | All |
| balloon | Object | Balloon content object with three properties: header, body, footer | All |
| icon | Object | Icon object with three properties: color (default value is 'blue'), content, glyph. Glyph property have higher priority than content. [List of colors and icons](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage-docpage/) | Placemark |
| marker-fill | Object | Fill properties object with two properties: enabled, color, opacity | Polygon, Rectangle, Circle |
| marker-stroke | Object | Stroke properties object with four properties: color, opacity, width, style | Polygon, Rectangle, Circle, Polyline |
| circle-radius | Number | Radius of circle in meters. Default value is 1000. | Circle |
| cluster-name | String | Attribute for grouping markers in clusters | All |

# License

MIT
