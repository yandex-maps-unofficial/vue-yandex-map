export function createCallbacks(callbacks, placemark) {
  if (callbacks && typeof callbacks === 'object') {
    Object.keys(callbacks).forEach((key) => {
      placemark.events.add(key, callbacks[key]);
    });
  }
}

export function addToMap(markers, {
  options, callbacks, map, useObjectManager, objectManagerClusterize,
}) {
  const defaultLayout = `
      <div>{{ properties.balloonContentHeader }}</div>
      <div>{{ properties.balloonContentBody }}</div>
      <div>{{ properties.balloonContentFooter }}</div>
    `;
  const defaultClusterLayout = 'cluster#balloonTwoColumns';

  const clusters = {};
  const unclastered = [];
  markers.forEach((marker) => {
    if (!marker.clusterName) unclastered.push(marker);
    else {
      clusters[marker.clusterName] = clusters[marker.clusterName]
        ? [...clusters[marker.clusterName], marker] : [marker];
    }
  });

  Object.keys(clusters).forEach((clusterName) => {
    const clusterOptions = options[clusterName] || {};
    const clusterCallbacks = callbacks[clusterName] || {};
    const layout = clusterOptions.layout || defaultLayout;
    clusterOptions.clusterBalloonItemContentLayout = ymaps.templateLayoutFactory
      .createClass(layout);

    const clusterLayout = clusterOptions.clusterLayout
      ? ymaps.templateLayoutFactory.createClass(clusterOptions.clusterLayout)
      : clusterOptions.clusterBalloonContentLayout || defaultClusterLayout;
    clusterOptions.clusterBalloonContentLayout = clusterLayout;

    const { clusterIconContentLayout } = clusterOptions;
    clusterOptions.clusterIconContentLayout = clusterIconContentLayout
      && ymaps.templateLayoutFactory.createClass(clusterIconContentLayout);

    if (useObjectManager) {
      const ObjectManager = new ymaps.ObjectManager(Object.assign(
        { clusterize: objectManagerClusterize },
        clusterOptions,
      ));
      Object.keys(clusterCallbacks).forEach((key) => {
        ObjectManager.clusters.events.add(key, clusterCallbacks[key]);
      });
      ObjectManager.add(clusters[clusterName]);
      map.geoObjects.add(ObjectManager);
    } else {
      const clusterer = new ymaps.Clusterer(clusterOptions);
      Object.keys(clusterCallbacks).forEach((key) => {
        clusterer.events.add(key, clusterCallbacks[key]);
      });

      if (clusterOptions.createCluster) {
        clusterer.createCluster = clusterOptions.createCluster;
      }

      clusterer.add(clusters[clusterName]);
      map.geoObjects.add(clusterer);
    }
  });
  if (unclastered.length) {
    const unclasteredMarkers = useObjectManager
      ? new ymaps.ObjectManager({ clusterize: false }) : new ymaps.GeoObjectCollection();
    unclastered.forEach(obj => unclasteredMarkers.add(obj));
    map.geoObjects.add(unclasteredMarkers);
  }
}

export function setFirstLetterToUppercase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getIconPreset(marker) {
  const firstPart = marker.icon.color || 'blue';
  let secondPart;
  if (marker.icon.glyph) {
    secondPart = setFirstLetterToUppercase(marker.icon.glyph);
  } else if (marker.icon.content) {
    secondPart = 'Stretchy';
  } else {
    secondPart = '';
  }
  return firstPart + secondPart;
}

export function setCoordsToNumeric(arr) {
  return arr.map(item => (Array.isArray(item) ? setCoordsToNumeric(item) : +item));
}

export function objectComparison(first, second) {
  const cache = []; // кеш обьектов, для избежания рекурсии

  function inCache(f, s) {
    let i = cache.length;
    while (i--) {
      if (
        (cache[i][0] === f || cache[i][0] === s) && (cache[i][1] === s || cache[i][1] === f)
      ) return true;
    }
    return false;
  }

  return (function eq(f, s) {
    if (f === s) return true; // сравниваем обычным образом
    if (f instanceof Date && s instanceof Date) return +f === +s; // время
    if (typeof f !== 'object' || typeof s !== 'object') return false; // если хотябы один из аргументов не объект (положительный случай для необъектов рассмотрен выше)
    if (inCache(f, s)) return true; // есть в кеше
    cache.push([f, s]); // кешируем

    const keys = Object.keys(f); let
      i = keys.length; // получаем ключи
    if (Object.keys(s).length !== i) return false; // если количество ключей не совпадает
    while (i--) if (!eq(f[keys[i]], s[keys[i]])) return false; // рекурсивный вызов

    return true;
  }(first, second));
}

class EventEmitter {
  constructor() {
    this.events = {};
    this.ymapReady = false;
    this.scriptIsNotAttached = true;
  }

  $on(eventName, fn) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(fn);

    return () => {
      this.events[eventName] = this.events[eventName].filter(eventFn => fn !== eventFn);
    };
  }

  $emit(eventName, data) {
    const event = this.events[eventName];
    if (event) {
      event.forEach(fn => fn(data));
    }
  }
}

export const emitter = new EventEmitter();

const CONTROL_TYPES = [
  'fullscreenControl',
  'geolocationControl',
  'routeEditor',
  'rulerControl',
  'searchControl',
  'trafficControl',
  'typeSelector',
  'zoomControl',
  'routePanelControl',
];

export function controlsTypeValidator(val) {
  return val.filter(control => ![...CONTROL_TYPES, 'default'].includes(control)).length === 0;
}

export function createMarkerType(val, useObjectManager) {
  const type = setFirstLetterToUppercase(val);
  if (!useObjectManager) return type;
  switch (type) {
    case 'Placemark':
      return 'Point';
    case 'Polyline':
      return 'LineString';
    default:
      return type;
  }
}

export function createMarker(object, useObjectManager) {
  const marker = useObjectManager ? {
    type: 'Feature',
    id: object.properties.markerId,
    geometry: {
      type: object.markerType,
      coordinates: object.coords,
    },
    properties: object.properties,
    options: object.options,
  } : new ymaps[object.markerType](object.coords, object.properties, object.options);

  marker.clusterName = object.clusterName;

  if (!useObjectManager) createCallbacks(object.callbacks, marker);

  return marker;
}

export function ymapLoader(settings = {}) {
  return new Promise((res, rej) => {
    const yandexMapScript = document.createElement('SCRIPT');
    const {
      apiKey = '',
      lang = 'ru_RU',
      version = '2.1',
      coordorder = 'latlong',
      debug = false,
    } = settings;
    const mode = debug ? 'debug' : 'release';
    const settingsPart = `lang=${lang}${apiKey && `&apikey=${apiKey}`}&mode=${mode}&coordorder=${coordorder}`;
    const link = `https://api-maps.yandex.ru/${version}/?${settingsPart}`;
    yandexMapScript.setAttribute('src', link);
    yandexMapScript.setAttribute('async', '');
    yandexMapScript.setAttribute('defer', '');
    document.body.appendChild(yandexMapScript);
    emitter.scriptIsNotAttached = false;
    yandexMapScript.onload = () => {
      emitter.ymapReady = true;
      emitter.$emit('scriptIsLoaded');
      res();
    };
    yandexMapScript.onerror = rej;
  });
}
