# Карта
После подключения плагина вы можете использовать компонент `<yandex-map>` для работы с картой. Параметры карты задаются через атрибуты. Вы можете получить доступ к [инстансу карты](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/) для работы напрямую с [API Я.Карт](https://tech.yandex.ru/maps/doc/jsapi/2.1/quick-start/index-docpage/), слушая событие `map-was-initialized`. Ссылка на инстанс будет передана как payload события.<br>

Вы можете задать класс элементу, в котором непосредственно находится карта через аттрибут `ymap-class`. Если этот атрибут не задан - элементу присваивается аттрибут `style="width: 100%; height: 100%;"`.<br>

По умолчанию маркеры добавляются на карту через `GeoObjectCollection`, но при большом количестве маркеров отрисовка карты может занимать продолжительное время даже при группировке маркеров в кластеры. В таком случае рекомендуется использовать `ObjectManager`, указав атрибут карты `useObjectManager`. Но в этом случае вы теряете возможность слушать события у каждого отдельного маркера.<br>

Атрибуты карты `coords`, `bounds` и `zoom` являются наблюдаемыми. Карта реагирует на их изменения. 

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
      <td>Ссылка на <a href="https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/">инстанс карты</a></td>
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
| settings | Object | Настройки карты. API Key, язык и версия. |
| coords | Array | Координаты центра карты. [ lat, lng ]. Может принимать модификатор `.sync`. *Required* |
| map-events | Array | Нативные события (события Я.Карт), которые эмитит карта. Если не задано, то карта будет эмитить все события, перечисленные в секции [Events](#events)  |
| zoom | Number | Значение зума карты (от 0 до 19). Может принимать модификатор `.sync`. *Default: 18*. |
| bounds | Array | Координаты левого нижнего и правого верхнего углов карты. Если аттрибут задан, то значения `coords` и `center` игнорируются. Может принимать модификатор `.sync`. |
| [cluster-options](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark-docpage/#param-options) | Object | Объект, где ключами являются имена кластеров, а значениями - объекты опций этих кластеров. Объект принимает поле `layout` (тип `String`) со строковым представлением HTML темплейта для `balloonItemContentLayout`, поле `clusterIconContentLayout` (тип `String`) для кастомизации иконки кластера и поле `clusterBalloonLayout` (тип `String`) для кастомизации балуна кластера: [Custom Balloon example](https://tech.yandex.ru/maps/jsbox/2.1/cluster_custom_balloon_content_layout). Также здесь можно передать переопределенную функцию `createCluster` для добавления своей логики при создание кластеров (опция `use-object-manager` при этом должна быть отключена).|
| cluster-callbacks | Object | Объект, где ключами являются имена кластеров, а значениями - объекты событий этих кластеров, напр. `{ clusterName: { click: function() {...}, contextmenu: anotherFunction } }` |
| [behaviors](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/map.behavior.Manager-docpage/#param-behaviors) | Array | Массив подключенных поведений карты. Все остальные значения считаются выключенными.|
| [controls](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/control.Manager-docpage/#add-param-control) | Array | Массив подключенных элементов управления картой. Все остальные значения считаются выключенными.|
| detailed-controls | Object | Объект, где ключами являются элементы управления картой, а значениями - объекты настроект элемента. Предназначен для тонкой настройки элементов управления. |
| map-type | String | Тип карты. Допустимые значения: `map, satellite, hybrid`. *Default: map*. |
| scroll-zoom | Boolean | Установите в значение `false`, чтобы при прокрутке страницы у карты не срабатывал зум. *Default: true* |
| placemarks  | Array of Objects | **Deprecated**. Используйте компонент маркера |
| use-object-manager  | Boolean | Установите в значение `true` для использования Object Mananger. Используйте при большом количестве маркеров на карте. *Default: false* |
| object-manager-clusterize  | Boolean | Кластеризация при использовании Object Mananger. *Default: true* |
| ymap-class  | String | Определяет класс для элемента, где рендерится инстанс карты. Если аттрибут не определен - элемент использует стиль: `width: 100%; height: 100%;` |
| init-without-markers  | Boolean | Установите значение в `false`, чтобы карта не отображалась при отсутствии маркеров. Default: `true` |
| show-all-markers  | Boolean | Установите значение в `true`, чтобы границы карты при инициализации вмещали все маркеры. Default: `false` |
| use-html-in-layout  | Boolean | Установите значение в `true`, чтобы передавать в поля в балун в виде html-разметки. Default: `false` |
| [options](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/#Map__param-options) | Object | Опции карты |
| balloon-component | Vue Component | Позволяет использовать компонент Vue в качестве балуна. Для работы необходима активация [runtimeCompiler](https://cli.vuejs.org/config/#runtimecompiler). **Только для Vue 2**|
