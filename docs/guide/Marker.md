# Маркер

Вы можете задать маркеры для карты, используя компонент `<ymap-marker>`.

::: danger Важно!
Начиная с версии `0.10` маркеры можно задавать только используя компонент `ymap-marker`. Атрибут карты `placemarks` не поддерживается.
:::

::: tip Обратите внимание
Для каждого маркера является обязательным указание свойста `markerId`
:::

Вы можете указать тип маркера, используя атрибут `marker-type`. Допустимые значения:
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

::: danger Важно!
Начиная с версии `0.10` атрибут `callbacks` не поддерживается. Слушайте события у компонента.
:::

## Attributes

| Attribute | Type | Description | Marker-types |
| ----- | ----- | ----- | ----- |
| marker-id | String, Number | Id маркера. `Required` ||
| marker-type | String | Тип маркера. Default: `Placemark` ||
| coords | Array [ latitude, longitude ] | Координаты маркера или центр круга. `Required` | Placemark, Circle |
| coords | Array of arrays [ [latitude, longitude], [...] ] | Координаты вершин. `Required` | Rectangle, Polyline |
| coords | Array of two arrays of coordinates arrays (first for outer contour, second for inner) [ [[latitude, longitude], [...]], [[...], [...]] ] | Координаты вершин. `Required` | Polygon |
| marker-events | Array | Нативные события (события Я.Карт), которые эмитит маркер. Если не задано, то маркер будет эмитить все события, перечисленные в секции [Events](#events) | All |
| hint-content | String | Содержимое подсказки | All |
| balloon | Object | Свойства балуна: header, body, footer | All |
| [icon](#icons) | Object | Иконка маркера | Placemark |
| marker-fill | Object | Свойства заливки: enabled, color, opacity, imageHref | Polygon, Rectangle, Circle |
| marker-stroke | Object | Свойства обводки: color, opacity, width, style | Polygon, Rectangle, Circle, Polyline |
| circle-radius | Number | Радиус окружности в метрах. Default: `1000`. | Circle |
| cluster-name | String | Имя кластера для группировки маркеров | All |
| properties | Object | [Свойства маркера](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject-docpage/#param-feature.properties) | All |
| options | Object | [Опции маркера](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject-docpage/#param-options) | All |
| [balloon-template](/examples/#кастомный-темпnейт-баnуна) | String | HTML Template for balloon | All |
| balloon-component-props | Object | Объект пропсов для балуна. _Только при инициализации балуна через balloonComponent_ | All |

## Slots

Вы можете передать темплейт балуна для маркера, используя слот `balloon`. Вы также можете поместить в этот слот компонент, но имейте ввиду, что в балун передается только представление компонента, его визуальная часть. Если вы хотите использовать какую-то логику (например действие по нажатию на кнопку внутри балуна), то вы можете использовать событие маркера `balloonopen` и навешивать любые обработчики на элементы вашего балуна. Не забудьте удалить обработчики при наступлении события `balloonclose`. [Пример](/examples/#испоnьзование-сnота-баnуна-в-маркере)
Также Вы можете определить макет балуна через слот `balloonLayout` в маркере. Содержимое данного слота заменит содержание стандартного макета для балуна. Будьте осторожны, если вы используете слот `balloonLayout`, слот `balloon` будет игнорироваться.

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
