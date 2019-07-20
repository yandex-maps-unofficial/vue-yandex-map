# Map
After installation, registration and plugged the component you can use `<yandex-map>` and work with a map. All parameters of the map are set via attributes. You can use `map-was-initialized` (tag or event listener) to get an access to [map instance](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/) for work directly with [YandexMap API](https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/). Link to the map instance will be transmitted as payload of event.<br>

You can assign a class to parent element of map via attribute `ymap-class`. If this attribute is not specified the element will be assign an attribute `style="width: 100%; height: 100%;"`.<br>

All markers are added to the map via `GeoObjectCollection` by default, but if there is a huge count of markers, the map rendering will take a lof of time even when markers grouping to clusters. In this case, it is recommended to use `ObjectManager` and assign the attribute of map `useObjectManager`, but then you lose the opportunity to specify to each markers `callback`.<br>

The attributes `coords`, `placemarks` и `zoom` are observable. The map is react if these attributes are changing.

## Events

| Event name | Payload |
| ----- | ----- |
| 'click' | [map event](https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/events-docpage/) |
| 'map-was-initialized' | Link to [map instance](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/) |

## Attributes

| Attribute | Type | Description |
| ----- | ----- | ----- |
| settings | Object | Settings of map. API Key, language and version. |
| coords | Array | Map center coordinates. [ lat, lng ]. *Required* |
| zoom | Number | Zoom map value (from 0 to 19). *Default: 18*. |
| cluster-options | Object | An object where the keys are the names of the clusters, and the values are the objects of options these clusters. In options you can point field `layout` (тип `String`) with HTML template for `balloonItemContentLayout`. [Cluster option](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark-docpage/#param-options) |
| cluster-callbacks | Object | An object where the keys are the names of the clusters, and the values are the objects of events these clusters, e.g. `{ clusterName: { click: function() {...}, contextmenu: anotherFunction } }` |
| behaviors | Array | Array of connected map behaviors. All other values are considered off. [Behaviors](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/map.behavior.Manager-docpage/#param-behaviors) |
| controls | Array | Array of connected map controls. All other values are considered offth. [Controls](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.Manager-docpage/#add-param-control) |
| detailed-controls | Object | An object where the keys are the elements of map control, and the values are the objects of element settings. Designed for fine setting of control elements. |
| map-type | String | Map type. Valid values: `map, satellite, hybrid`. *Default: map*. |
| scroll-zoom | Boolean | Set `false` to disable map zoom on the page when you are scrolling. *Default: true* |
| zoom-control  | Object | **Deprecated**. Use `detailed-controls` |
| placemarks  | Array of Objects | Array of map labels. There are markers only type of `placemark`. Objects with fields: coordinates ([lat, lng]), properties, options. [More](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Placemark-docpage/) |
| use-object-manager  | Boolean | Set `true` for use Object Mananger. Used if there is huge count of markers on the map. *Default: false* |
| object-manager-clusterize  | Boolean | Clustering with Object Mananger. *Default: true* |
| ymap-class  | String | Defines class for element, where rendering the map instance. If the attribute is not defined, the element uses style: `width: 100%; height: 100%;` |
| init-without-markers  | Boolean | Set`false`for prevent init and render map if there are not markers on the map. Default: `true` |
| options  | Object | [Map otions](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/#Map__param-options) |

