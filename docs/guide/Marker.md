# Маркер

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