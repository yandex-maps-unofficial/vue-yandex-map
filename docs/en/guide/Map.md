# Map
After installation, registration and plugged the component you can use `<yandex-map>` and work with a map. All parameters of the map are set via attributes. You can use `map-was-initialized` event to get an access to [map instance](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/) for work directly with [YandexMap API](https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/). Link to the map instance will be transmitted as payload of event.<br>

You can assign a class to parent element of map via attribute `ymap-class`. If this attribute is not specified the element will be assign an attribute `style="width: 100%; height: 100%;"`.<br>

All markers are added to the map via `GeoObjectCollection` by default, but if there is a huge count of markers, the map rendering will take a lof of time even when markers grouping to clusters. In this case, it is recommended to use `ObjectManager` and assign the attribute of map `useObjectManager`, but then you lose the opportunity to specify to each markers `callback`.<br>

The attributes `coords`, `placemarks` и `zoom` are observable. The map is react if these attributes are changing.

## Events

| Event name | Payload |
| ----- | ----- |
| 'click' | [map event](https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/events-docpage/) |
| 'map-was-initialized' | Link to [map instance](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/) |
| 'markers-was-change' | Array of changed markers ids |
| 'markers-was-delete' | Array of deleted markers ids |

## Attributes

| Attribute | Type | Description |
| ----- | ----- | ----- |
| settings | Object | Settings of map. API Key, language and version. |
| coords | Array | Map center coordinates. [ lat, lng ]. *Required* |
| zoom | Number | Zoom map value (from 0 to 19). *Default: 18*. |
| [cluster-options](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark-docpage/#param-options) | Object | An object where the keys are the names of the clusters, and the values are the objects of options these clusters. In options you can point field `clusterIconContentLayout` (type `String`) for HTML template of cluster icon, field `layout` (type `String`) and HTML template for `balloonItemContentLayout`. There is also `createCluster` field for overriding default creating cluster function (field `use-object-manager` have to be turned off).|
| cluster-callbacks | Object | An object where the keys are the names of the clusters, and the values are the objects of events these clusters, e.g. `{ clusterName: { click: function() {...}, contextmenu: anotherFunction } }` |
| [behaviors](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/map.behavior.Manager-docpage/#param-behaviors) | Array | Array of connected map behaviors. All other values are considered off.|
| [controls](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.Manager-docpage/#add-param-control) | Array | Array of connected map controls. All other values are considered offth.|
| detailed-controls | Object | An object where the keys are the elements of map control, and the values are the objects of element settings. Designed for fine setting of control elements. |
| map-type | String | Map type. Valid values: `map, satellite, hybrid`. *Default: map*. |
| scroll-zoom | Boolean | Set `false` to disable map zoom on the page when you are scrolling. *Default: true* |
| zoom-control  | Object | **Deprecated**. Use `detailed-controls` |
| placemarks  | Array of Objects | Array of map labels. There are markers only type of `placemark`. Objects with fields: coordinates ([lat, lng]), properties, options. [More](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Placemark-docpage/) |
| use-object-manager  | Boolean | Set `true` for use Object Manager. Used if there is huge count of markers on the map. *Default: false* |
| object-manager-clusterize  | Boolean | Clustering with Object Manager. *Default: true* |
| ymap-class  | String | Defines class for element, where rendering the map instance. If the attribute is not defined, the element uses style: `width: 100%; height: 100%;` |
| init-without-markers  | Boolean | Set to `false` for prevent init and render map if there are no markers on the map. Default: `true` |
| show-all-markers  | Boolean | Set to `true` to initialize map with all markers inside map bounds. Default: `false` |
| [options](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/#Map__param-options) | Object | Map options. |

