# Маркер

Вы можете задать маркеры для карты, используя компонент `<ymap-marker>` или передать их в качестве значения аттрибута карты `placemarks`. Во втором случае вы можете использовать только маркеры типа `Placemark`. [Описание интерфейса](https://tech.yandex.ru/maps/doc/jsapi/2.0/ref/reference/GeoObject-docpage/). Вы также можете использовать оба этих метода одновременно.

::: tip Обратите внимание
Для каждого маркера является обязательным указание свойста `markerId`
:::

Если вы задаете маркеры, используя компонент `<ymap-marker>` - вы можете указать его тип, используя аттрибут `marker-type`. Допустимые значения:
* Placemark
* Polyline
* Rectangle
* Polygon
* Circle

## Attributes

| Attribute | Type | Description | Marker-types |
| ----- | ----- | ----- | ----- |
| marker-id | String, Number | Id маркера. `Required` ||
| marker-type | String | Тип маркера. Default: `Placemark` ||
| coords | Array [ latitude, longitude ] | Координаты маркера или центр круга. `Required` | Placemark, Circle |
| coords | Array of arrays [ [latitude, longitude], [...] ] | Координаты вершин. `Required` | Rectangle, Polyline |
| coords | Array of two arrays of coordinates arrays (first for outer contour, second for inner) [ [[latitude, longitude], [...]], [[...], [...]] ] | Координаты вершин. `Required` | Polygon |
| hint-content | String | Содержимое подсказки | All |
| balloon | Object | Свойства балуна: header, body, footer | All |
| [icon](#icons) | Object | Иконка маркера | Placemark |
| marker-fill | Object | Свойства заливки: enabled, color, opacity, imageHref | Polygon, Rectangle, Circle |
| marker-stroke | Object | Свойства обводки: color, opacity, width, style | Polygon, Rectangle, Circle, Polyline |
| circle-radius | Number | Радиус окружности в метрах. Default: `1000`. | Circle |
| cluster-name | String | Имя кластера для группировки маркеров | All |
| properties | Object | [Свойства маркера](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject-docpage/#param-feature.properties) | All |
| options | Object | [Опции маркера](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject-docpage/#param-options) | All |
| callbacks | Object | Объект, где ключом является имя события, а значением - callback-функция, напр. { click: function() {...}, contextmenu: anotherFunction }. [Список событий](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject-docpage/#events-summary) | All |
| [balloonTemplate](/examples/#кастомный-темпnейт-баnуна) | String | HTML Template for balloon | All |

## Icons

Вы можете задать настройки иконки маркера следующими полями: color (default: 'blue'), content, glyph. Свойство `glyph` имеет более высокий приоритете, чем `content`. [Список цветов и иконок](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage-docpage/). В этом случае вы получаете классический вид маркера.

Вы можете также задать вашу собственную иконку для маркера. В этом случае объект настроек должен выглядеть следующим образом:

```JavaScript
{
  layout: 'default#image', // 'default#imageWithContent' для использования с контентом
  imageHref: markerIcon, // адрес изображения или data:image/svg+xml;base64
  imageSize: [43, 55], // размер иконки в px
  imageOffset: [-22, -55], // смещение иконки в px,
  /* Следующие поля актуальны для layout: 'default#imageWithContent' */
  content: 'some content here', // содержимое контента
  contentOffset: [-22, -55], // смещение контента в px,
  contentLayout: '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>' // строковый HTML шаблон для контента
}

```

[Пример использования](/examples/#кастомная-иконка)
