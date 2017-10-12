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

You may define placemarks on your map by using `<ymap-marker>` tag or set an array of objects with placemark options through `<yandex-map>` attribute `placemarks`. You also can use both methods together.
The Map instance rerender when changed link on array with markers in `placemarks` property or marker coordinates if marker is a component. 

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
  :placemarks="placemarks" // 
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

```JavaScript

data() {
  return {
    placemarks: [
      {
        coords: [54.8, 39.8],
        properties: {}, // define properties here
        options: {}, // define options here
        clusterName: "1",
        callbacks: { click: function() {} }
      }
    ]
  }
}

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
| scroll-zoom | Boolean | Set to false to disable zoom map on scroll page |
| zoom-control  | Object | Configs for zoomControl of the map. [More](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.ZoomControl-docpage/) |
| placemarks  | Array of Objects | Array of config objects with fields: coordinates ([lat, lon]), properties, options. [More](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Placemark-docpage/) |

## Marker attributes

| Attribute | Type | Description | Marker-types |
| ----- | ----- | ----- | ----- |
| marker-type | String | Type of marker ||
| coords | Array [ latitude, longtitude ] | Coordinates of point or circle center. Required | Placemark, Circle |
| coords | Array of arrays [ [latitude, longtitude], [...] ] | Coordinates of shape corners. Required | Rectangle, Polyline |
| coords | Array of two arrays of coordinates arrays (first for outer contour, second for inner) [ [[latitude, longtitude], [...]], [[...], [...]] ] | Coordinates of shape corners. Required | Polygon |
| hint-content | String | Tooltip content | All |
| balloon | Object | Balloon content object with three properties: header, body, footer | All |
| icon | Object | [About icons](#icons) | Placemark |
| marker-fill | Object | Fill properties object with two properties: enabled, color, opacity | Polygon, Rectangle, Circle |
| marker-stroke | Object | Stroke properties object with four properties: color, opacity, width, style | Polygon, Rectangle, Circle, Polyline |
| circle-radius | Number | Radius of circle in meters. Default value is 1000. | Circle |
| cluster-name | String | Attribute for grouping markers in clusters | All |
| callbacks | Object | Object, where key is an event name and value is a callback function, e.g. { click: function() {...}, contextmenu: anotherFunction }. [Events list](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject-docpage/#events-summary) | All |

# Icons

You may define icon attribute as object with three properties: color (default value is 'blue'), content, glyph. Glyph property have higher priority than content. [List of colors and icons](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage-docpage/). In this way you get classic placemark.

Or you may define it as a placemark with custom icon. In this case you need to set the object of the following form: 

```JavaScript
{
  layout: 'default#image',
  imageHref: markerIcon,
  imageSize: [43, 55],
  imageOffset: [-22, -55]
}

```

where `markerIcon`: data or computed path to image or data:image/svg+xml;base64, `imageSize`: size of icon in px, `imageOffset`: icon offset in px

# License

MIT
