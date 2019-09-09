# Карта
После подключения плагина вы можете использовать компонент `<yandex-map>` для работы с картой. Параметры карты задаются через аттрибуты. Вы можете получить доступ к [инстансу карты](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/) для работы напрямую с [API Я.Карт](https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/), слушая событие `map-was-initialized`. Ссылка на инстанс будет передана как payload события.<br>

Вы можете задать класс элементу, в котором непосредственно находится карта через аттрибут `ymap-class`. Если этот аттрибут не задан - элементу присваивается аттрибут `style="width: 100%; height: 100%;"`.<br>

По умолчанию маркеры добавляются на карту через `GeoObjectCollection`, но при большом количестве маркеров отрисовка карты может занимать продолжительное время даже при группировке маркеров в кластеры. В таком случае рекомендуется использовать `ObjectManager`, указав атрибут карты `useObjectManager`. Но в этом случае вы теряете возможность указать каждому маркеру `callback`.<br>

Аттрибуты карты `coords`, `placemarks` и `zoom` являются наблюдаемыми. Карта реагирует на их изменения. 

## Events

| Event name | Payload |
| ----- | ----- |
| 'click' | [map event](https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/events-docpage/) |
| 'map-was-initialized' | Ссылка на [инстанс карты](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/) |

## Attributes

| Attribute | Type | Description |
| ----- | ----- | ----- |
| settings | Object | Настройки карты. API Key, язык и версия. |
| coords | Array | Координаты центра карты. [ lat, lng ]. *Required* |
| zoom | Number | Значение зума карты (от 0 до 19). *Default: 18*. |
| cluster-options | Object | Объект, где ключами являются имена кластеров, а значениями - объекты опций этих кластеров. Объект принимает поле `layout` (тип `String`) со строковым представлением HTML темплейта для `balloonItemContentLayout`. [Cluster option](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark-docpage/#param-options), поле `clusterIconContentLayout` (тип `String`) для кастомизации иконки кластера и поле `clusterLayout` (тип `String`) для кастомизации балуна кластера: [Custom Balloon example](https://tech.yandex.ru/maps/jsbox/2.1/cluster_custom_balloon_content_layout) |
| cluster-callbacks | Object | Объект, где ключами являются имена кластеров, а значениями - объекты событий этих кластеров, напр. `{ clusterName: { click: function() {...}, contextmenu: anotherFunction } }` |
| behaviors | Array | Массив подключенных поведений карты. Все остальные значения считаются выключенными. [Behaviors](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/map.behavior.Manager-docpage/#param-behaviors) |
| controls | Array | Массив подключенных элементов управления картой. Все остальные значения считаются выключенными. [Controls](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.Manager-docpage/#add-param-control) |
| detailed-controls | Object | Объект, где ключами являются элементы управления картой, а значениями - объекты настроект элемента. Предназначен для тонкой настройки элементов управления. |
| map-type | String | Тип карты. Допустимые значения: `map, satellite, hybrid`. *Default: map*. |
| scroll-zoom | Boolean | Установите в значение `false`, чтобы при прокрутке страницы у карты не срабатывал зум. *Default: true* |
| zoom-control  | Object | **Deprecated**. Используйте `detailed-controls` |
| placemarks  | Array of Objects | Массив меток карты. Только маркеры типа `placemark`. Объекты с полями: coordinates ([lat, lng]), properties, options. [More](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Placemark-docpage/) |
| use-object-manager  | Boolean | Установите в значение `true` для использования Object Mananger. Используйте при большом количестве маркеров на карте. *Default: false* |
| object-manager-clusterize  | Boolean | Кластеризация при использовании Object Mananger. *Default: true* |
| ymap-class  | String | Определяет класс для элемента, где рендерится инстанс карты. Если аттрибут не определен - элемент использует стиль: `width: 100%; height: 100%;` |
| init-without-markers  | Boolean | Установите значение в `false`, чтобы карта не отображалась при отсутствии маркеров. Default: `true` |
| options  | Object | [Опции карты](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/#Map__param-options) |
