# Marker

You can define map markers by using component `<ymap-marker>` or using these markers like map attribute `placemarks`. In second time you can use only `Placemark` type markers. [Interface description](https://tech.yandex.ru/maps/doc/jsapi/2.0/ref/reference/GeoObject-docpage/). You can use both these methods in parallel.

::: tip Take a look,
For each marker you need to add property `markerId` 
:::

If you define markers through component `<ymap-marker>` - you can indicate its type by using attribute `marker-type`. Allowable values:
* Placemark
* Polyline
* Rectangle
* Polygon
* Circle

## Attributes

| Attribute | Type | Description | Marker-types |
| ----- | ----- | ----- | ----- |
| marker-id | String, Number | Marker id. `Required` ||
| marker-type | String | Marker type. Default: `Placemark` ||
| coords | Array [ latitude, longitude ] | Marker's coordinates or circle center. `Required` | Placemark, Circle |
| coords | Array of arrays [ [latitude, longitude], [...] ] | Coordinates of tops. `Required` | Rectangle, Polyline |
| coords | Array of two arrays of coordinates arrays (first for outer contour, second for inner) [ [[latitude, longitude], [...]], [[...], [...]] ] | Coordinates of tops. `Required` | Polygon |
| hint-content | String | Content of tip | All |
| balloon | Object | Balloon properties: header, body, footer | All |
| [icon](#icons) | Object | Marker's icon | Placemark |
| marker-fill | Object | Fill properties: enabled, color, opacity, imageHref | Polygon, Rectangle, Circle |
| marker-stroke | Object | Border properties: color, opacity, width, style | Polygon, Rectangle, Circle, Polyline |
| circle-radius | Number | Radius of the circle in meters. Default: `1000`. | Circle |
| cluster-name | String | Cluster name to grouping of markers | All |
| properties | Object | [Marker settings](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject-docpage/#param-feature.properties) | All |
| options | Object | [Marker options](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject-docpage/#param-options) | All |
| callbacks | Object | Object where the key is name of event, and the value is callback-function, e.g. { click: function() {...}, contextmenu: anotherFunction }. [List of events](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject-docpage/#events-summary) | All |
| [balloonTemplate](/examples/#кастомный-темпnейт-баnуна) | String | HTML Template for balloon | All |

# Icons

You can define settings of marker icons through fields: color (default: 'blue'), content, glyph. Property `glyph` has priority higher then  `content`. [List of colours and icons](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage-docpage/). In this case you get classical view of marker.

You can also define your personal icon for marker. In this case the object of settings should be as follows:

```JavaScript
{
  layout: 'default#image',
  imageHref: markerIcon, // address of image or data:image/svg+xml;base64
  imageSize: [43, 55], // icon size в px
  imageOffset: [-22, -55] // offset в px
}

```
