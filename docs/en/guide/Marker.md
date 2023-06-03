# Marker

You can define map markers by using component `<ymap-marker>`.

::: danger Attention!
Since version `0.10` you can define markers through `ymap-marker` only. Map attribute `placemarks` not supported
:::

::: tip Take a look,
For each marker you need to add property `markerId` 
:::

You can indicate marker type by using attribute `marker-type`. Allowable values:
* Placemark
* Polyline
* Rectangle
* Polygon
* Circle

## Events

<table>
  <thead>
    <tr>
      <th>Event name</th>
      <th>Payload</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/GeoObject-docpage/#GeoObject__events-summary">balloonclose</a></td>
      <td rowspan="12" style="text-align: center;">
        <a href="https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/events-docpage/">marker event</a>
      </td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/GeoObject-docpage/#GeoObject__events-summary">balloonopen</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/GeoObject-docpage/#GeoObject__events-summary">click</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/GeoObject-docpage/#GeoObject__events-summary">contextmenu</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/GeoObject-docpage/#GeoObject__events-summary">dblclick</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/GeoObject-docpage/#GeoObject__events-summary">drag</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/GeoObject-docpage/#GeoObject__events-summary">dragend</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/GeoObject-docpage/#GeoObject__events-summary">dragstart</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/GeoObject-docpage/#GeoObject__events-summary">hintclose</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/GeoObject-docpage/#GeoObject__events-summary">hintopen</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/GeoObject-docpage/#GeoObject__events-summary">mouseenter</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/GeoObject-docpage/#GeoObject__events-summary">mouseleave</a></td>
    </tr>
  </tbody>
</table>

::: danger Attention!
Since version `0.10` attribute `callbacks` not supported. You can listen component events.
:::

## Attributes

| Attribute | Type | Description | Marker-types |
| ----- | ----- | ----- | ----- |
| marker-id | String, Number | Marker id. `Required` ||
| marker-type | String | Marker type. Default: `Placemark` ||
| coords | Array [ latitude, longitude ] | Marker's coordinates or circle center. `Required` | Placemark, Circle |
| coords | Array of arrays [ [latitude, longitude], [...] ] | Coordinates of tops. `Required` | Rectangle, Polyline |
| coords | Array of two arrays of coordinates arrays (first for outer contour, second for inner) [ [[latitude, longitude], [...]], [[...], [...]] ] | Coordinates of tops. `Required` | Polygon |
| marker-events | Array | Native events, which marker emits. If not provided, marker will be emit all events, from section [Events](#events) | All |
| hint-content | String | Content of tip | All |
| balloon | Object | Balloon properties: header, body, footer | All |
| [icon](#icons) | Object | Marker's icon | Placemark |
| marker-fill | Object | Fill properties: enabled, color, opacity, imageHref | Polygon, Rectangle, Circle |
| marker-stroke | Object | Border properties: color, opacity, width, style | Polygon, Rectangle, Circle, Polyline |
| circle-radius | Number | Radius of the circle in meters. Default: `1000`. | Circle |
| cluster-name | String | Cluster name to grouping of markers | All |
| properties | Object | [Marker settings](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject-docpage/#param-feature.properties) | All |
| options | Object | [Marker options](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject-docpage/#param-options) | All |
| [balloonTemplate](/en/examples/#custom-cluster-balloon) | String | HTML Template for balloon | All |
| balloon-component-props | Object | Props object for balloon. _Use only for balloonComponent_ | All |

## Slots

You may to define balloon template through `balloon` slot in marker. Also you may place your custom component into this slot, but keep in mind that balloon only render view of this component and discard any logic. If you need to add some user interactive (eg handle button click), you may to listen event `balloonopen` and bind any handlers to your balloon elements. Don't forget to delete these handlers on `balloonclose`. [Example](/en/examples/#balloon-slot-in-marker)
Also you may define balloon layout through `balloonLayout` slot in marker. It's rewrite default yandex layout for balloon. Be careful, if you use `balloonLayout` slot, `balloon` slot will be ignored

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
