# Map
After installation, registration and plugged the component you can use `<yandex-map>` and work with a map. All parameters of the map are set via attributes. You can use `map-was-initialized` event to get an access to [map instance](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/) for work directly with [YandexMap API](https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/). Link to the map instance will be transmitted as payload of event.<br>

You can assign a class to parent element of map via attribute `ymap-class`. If this attribute is not specified the element will be assign an attribute `style="width: 100%; height: 100%;"`.<br>

All markers are added to the map via `GeoObjectCollection` by default, but if there is a huge count of markers, the map rendering will take a lof of time even when markers grouping to clusters. In this case, it is recommended to use `ObjectManager` and assign the attribute of map `useObjectManager`, but then you lose the opportunity to listen events by each marker.<br>

The attributes `coords`, `bounds` and `zoom` are observable. The map is react if these attributes are changing.

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
      <td>map-was-initialized</td>
      <td>Link to <a href="https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/">map instance</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/Map-docpage/#Map__events-summary">actionend</a></td>
      <td rowspan="13" style="text-align: center;">
        <a href="https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/events-docpage/">map event</a>
      </td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/Map-docpage/#Map__events-summary">balloonclose</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/Map-docpage/#Map__events-summary">balloonopen</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/Map-docpage/#Map__events-summary">boundschange</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/Map-docpage/#Map__events-summary">click</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/Map-docpage/#Map__events-summary">contextmenu</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/Map-docpage/#Map__events-summary">dblclick</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/Map-docpage/#Map__events-summary">destroy</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/Map-docpage/#Map__events-summary">hintclose</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/Map-docpage/#Map__events-summary">hintopen</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/Map-docpage/#Map__events-summary">optionschange</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/Map-docpage/#Map__events-summary">sizechange</a></td>
    </tr>
    <tr>
      <td><a href="https://tech.yandex.ru/maps/jsapi/doc/2.1/ref/reference/Map-docpage/#Map__events-summary">typechange</a></td>
    </tr>
  </tbody>
</table>

## Attributes

| Attribute | Type | Description |
| ----- | ----- | ----- |
| settings | Object | Settings of map. API Key, language and version. |
| coords | Array | Map center coordinates. [ lat, lng ]. May use with `.sync`. *Required* |
| map-events | Array | Native events, which map emits. If not provided, map will be emit all events, from section [Events](#events) | All |
| zoom | Number | Zoom map value (from 0 to 19). May use with `.sync`. *Default: 18*. |
| bounds | Array | Coordinates of the left bottom and right top corners of the map. If defined, `coords` and `center` are ignored. May use with `.sync`. |
| [cluster-options](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark-docpage/#param-options) | Object | An object where the keys are the names of the clusters, and the values are the objects of options these clusters. In options you can point field `layout` (type `String`) for HTML template for `balloonItemContentLayout`, field `clusterIconContentLayout` (type `String`) for cluster icon customization and field `clusterBalloonLayout` (type `String`) for cluster balloon customization: [Custom Balloon example](https://tech.yandex.ru/maps/jsbox/2.1/cluster_custom_balloon_content_layout). There is also `createCluster` field for overriding default creating cluster function (field `use-object-manager` have to be turned off).|
| cluster-callbacks | Object | An object where the keys are the names of the clusters, and the values are the objects of events these clusters, e.g. `{ clusterName: { click: function() {...}, contextmenu: anotherFunction } }` |
| [behaviors](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/map.behavior.Manager-docpage/#param-behaviors) | Array | Array of connected map behaviors. All other values are considered off.|
| [controls](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.Manager-docpage/#add-param-control) | Array | Array of connected map controls. All other values are considered offth.|
| detailed-controls | Object | An object where the keys are the elements of map control, and the values are the objects of element settings. Designed for fine setting of control elements. |
| map-type | String | Map type. Valid values: `map, satellite, hybrid`. *Default: map*. |
| scroll-zoom | Boolean | Set `false` to disable map zoom on the page when you are scrolling. *Default: true* |
| placemarks  | Array of Objects | **Deprecated**. Use marker component |
| use-object-manager  | Boolean | Set `true` for use Object Manager. Used if there is huge count of markers on the map. *Default: false* |
| object-manager-clusterize  | Boolean | Clustering with Object Manager. *Default: true* |
| ymap-class  | String | Defines class for element, where rendering the map instance. If the attribute is not defined, the element uses style: `width: 100%; height: 100%;` |
| init-without-markers  | Boolean | Set to `false` for prevent init and render map if there are no markers on the map. Default: `true` |
| show-all-markers  | Boolean | Set to `true` to initialize map with all markers inside map bounds. Default: `false` |
| use-html-in-layout  | Boolean | Set to `true` to define balloon properties as html. Default: `false` |
| [options](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/#Map__param-options) | Object | Map options. |
| balloon-component | Vue Component | Allow to use Vue Component as balloon. Need to activate [runtimeCompiler](https://cli.vuejs.org/config/#runtimecompiler). **Vue 2 only**|
