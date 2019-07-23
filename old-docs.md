
# vue-yandex-maps

vue-yandex-maps is a plugin for vue.js that adds yandex-map custom element.

# Install

```Bash
npm install vue-yandex-maps --save
```

# Register component

You may define config for map:
* `apiKey: String` // '' by default [Documentation](https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/load-docpage/)
* `lang: String` // 'ru_RU' by default [Available langs](https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/localization-docpage/)
* `version: String` // '2.1' by default

```JavaScript
const settings = { // you may define your apiKey, lang and version or skip this.
  apiKey: 'xxx',
  lang: 'ru_RU',
  version: '2.1'
}
```
### Register globally
```JavaScript
import YmapPlugin from 'vue-yandex-maps'
Vue.use(YmapPlugin, settings)
```
### Or for a single instance
```JavaScript
import { yandexMap, ymapMarker } from 'vue-yandex-maps'
new Vue({
  components: { yandexMap, ymapMarker }
})

```
```HTML
<yandex-map
    :settings="settings"
>
    <!--Markers-->
</yandex-map>
```

### Nuxt module

Add `vue-yandex-maps/nuxt` to modules section of `nuxt.config.js`

```JavaScript
{
  modules: [
    ['vue-yandex-maps/nuxt', settings]
  ]
}
```

### Direct include

You can use the CDN: https://unpkg.com/vue-yandex-maps, `yandexMap` is exposed to `window` and will automatically install itself. It might be useful for [Code Pen](https://codepen.io/PNKBizz/pen/WMRwyM)

## Usage

Use `<yandex-map>` tag to enable the map instance and use attributes to define map options.

`<yandex-map>` has a class `ymap-container` and child element, where rendering map instance. Child class you may define through map attribute `ymap-class`. If you doesn't define this class - child element will have `style` attribute with `width: 100%; height: 100%;`

If you have a lot of markers on your map i strongly recommend you to use map attribute `useObjectManager`. But in this case you can't set callbacks to your markers through marker attribute `callbacks`.

You may define placemarks on your map by using `<ymap-marker>` tag or set an array of objects with placemark options through `<yandex-map>` attribute `placemarks` ([interface description](https://tech.yandex.ru/maps/doc/jsapi/2.0/ref/reference/GeoObject-docpage/)). You also can use both methods together.<br>
You must define `markerId` for every marker on your map in any case fo setting (through map attribute `placemarks` or using `ymap-marker` components).<br>
The Map instance rerender when changed array with markers or marker properties if marker is a component.<br>
Also map watch property `coords` and react without rerender, when it changed.

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
  :placemarks="placemarks"
  map-type="hybrid"
  @map-was-initialized="initHandler"
>

    <ymap-marker
      marker-id="1"
      marker-type="placemark"
      :coords="[54.7, 39.7]"
      hint-content="Hint content 1"
      :balloon="{header: 'header', body: 'body', footer: 'footer'}"
      :icon="{color: 'green', glyph: 'cinema'}"
      cluster-name="1"
    ></ymap-marker>

    <ymap-marker
      marker-id="2"
      marker-type="placemark"
      :coords="[54.6, 39.8]"
      hint-content="Hint content 1"
      :balloon="{header: 'header', body: 'body', footer: 'footer'}"
      :icon="{color: 'green', glyph: 'cinema'}"
      cluster-name="1"
    ></ymap-marker>

    <ymap-marker
      marker-id="3"
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
        balloonTemplate: '<div>"Your custom template"</div>'
        callbacks: { click: function() {} }
      }
    ]
  }
}

```

# Events

## Map events

| Event name | Payload |
| ----- | ----- |
| 'click' | [map event](https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/events-docpage/) |
| 'map-was-initialized' | Link to map instance |

# Attributes

## Map attributes

| Attribute | Type | Description |
| ----- | ----- | ----- |
| settings | Object | Map settings. You may define your apiKey, lang and version or skip this. |
| coords | Array [ latitude, longtitude ] | Coordinates of map center. Required |
| zoom | Number | Zoom of map (from 0 to 19). Default: `18`. |
| cluster-options | Object | Map, where key is a name of cluster and value is an object of cluster options. Also you may set field 'layout' (type `String`) in cluster options object with HTML Template for balloonItemContentLayout. [Cluster option](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark-docpage/#param-options) |
| cluster-callbacks | Object | Map, where key is a name of cluster and value is an object, where key is an event name and value is a callback function, e.g. { click: function() {...}, contextmenu: anotherFunction } |
| behaviors | Array | Array of enabled map behaviors. All another will be disabled. [Behaviors](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/map.behavior.Manager-docpage/#param-behaviors) |
| controls | Array | Array of enabled map controls. All another will be disabled. [Controls](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.Manager-docpage/#add-param-control) |
| detailed-controls | Object | Map, where key is a name of control and value is an object of control options. |
| map-type | String | Map type. Possible types: `map, satellite, hybrid`. Default: `map`. |
| scroll-zoom | Boolean | Set to `false` to disable zoom map on scroll page. Default: `true` |
| zoom-control  | Object | Configs for zoomControl of the map. [More](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.ZoomControl-docpage/) |
| placemarks  | Array of Objects | Array of config objects with fields: coordinates ([lat, lng]), properties, options. [More](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Placemark-docpage/) |
| use-object-manager  | Boolean | Set to `true` to use Object Mananger in map. Default: `false` |
| object-manager-clusterize  | Boolean | Defines using clusterize in Object Mananger. Default: `true` |
| ymap-class  | String | Defines class for element, where rendering map instance. If not defined - element use style: `width: 100%; height: 100%;` |
| init-without-markers  | Boolean | Set to `false` to prevent map initialization if there is no markers. Default: `true` |
| options  | Object | [Map options](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/#Map__param-options) |

## Marker attributes

| Attribute | Type | Description | Marker-types |
| ----- | ----- | ----- | ----- |
| marker-id | String, Number | Marker Id. `Required` ||
| marker-type | String | Type of marker ||
| coords | Array [ latitude, longtitude ] | Coordinates of point or circle center. `Required` | Placemark, Circle |
| coords | Array of arrays [ [latitude, longtitude], [...] ] | Coordinates of shape corners. `Required` | Rectangle, Polyline |
| coords | Array of two arrays of coordinates arrays (first for outer contour, second for inner) [ [[latitude, longtitude], [...]], [[...], [...]] ] | Coordinates of shape corners. Required | Polygon |
| hint-content | String | Tooltip content | All |
| balloon | Object | Balloon content object with three properties: header, body, footer | All |
| icon | Object | [About icons](#icons) | Placemark |
| marker-fill | Object | Fill properties object with four properties: enabled, color, opacity, imageHref | Polygon, Rectangle, Circle |
| marker-stroke | Object | Stroke properties object with four properties: color, opacity, width, style | Polygon, Rectangle, Circle, Polyline |
| circle-radius | Number | Radius of circle in meters. Default: `1000`. | Circle |
| cluster-name | String | Attribute for grouping markers in clusters | All |
| properties | Object | Object with marker [properties](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject-docpage/#param-feature.properties) | All |
| options | Object | Object with marker [options](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject-docpage/#param-options) | All |
| callbacks | Object | Object, where key is an event name and value is a callback function, e.g. { click: function() {...}, contextmenu: anotherFunction }. [Events list](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject-docpage/#events-summary) | All |
| [balloonTemplate](#balloon-template) | String | HTML Template for balloon | All |

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

If you need to use it with content, just change the layout as `default#imageWithContent`

where `markerIcon`: data or computed path to image or data:image/svg+xml;base64, `imageSize`: size of icon in px, `imageOffset`: icon offset in px

# Balloon Template

You can define your own template for balloon.

```HTML
<yandex-map
  :coords="[54.62896654088406, 39.731893822753904]"
>
  <ymap-marker
      marker-type="placemark"
      :coords="[54.7, 39.7]"
      :balloonTemplate = "balloonTemplate"
    ></ymap-marker>
</yandex-map>

```

```JavaScript
computed: {
  balloonTemplate() {
    return `
      <h1 class="red">Hi, everyone!</h1>
      <p>I am here: ${this.coords}</p>
      <img src="http://via.placeholder.com/350x150">
    `
  }
}

```

```CSS
.red {
  color: red;
}

```

# License

MIT
