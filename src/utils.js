export function createCallbacks(callbacks, placemark) {
    if (callbacks && typeof callbacks === 'object') {
        for (let key in callbacks) {
            placemark.events.add(key, callbacks[key]);
        }
    }
}

export function addToCart(markers, { options, callbacks, map, useObjectManager, objectManagerClusterize }) {
    const defaultLayout = `
      <div>{{ properties.balloonContentHeader }}</div>
      <div>{{ properties.balloonContentBody }}</div>
      <div>{{ properties.balloonContentFooter }}</div>
    `;
    let clusters = {};
    let unclastered = [];
    for (let marker of markers) {
        if (!marker.clusterName) {
            unclastered.push(marker);
            continue;
        };
        clusters[marker.clusterName] = clusters[marker.clusterName] ? [...clusters[marker.clusterName], marker] : [marker];
    }
    for (let clusterName in clusters) {
        const clusterOptions = options[clusterName] || {};
        const clusterCallbacks = callbacks[clusterName] || {};
        const layout = clusterOptions.layout || defaultLayout;
        clusterOptions.clusterBalloonItemContentLayout = ymaps.templateLayoutFactory.createClass(layout);
        if (useObjectManager) {
            const ObjectManager = new ymaps.ObjectManager(Object.assign({ clusterize: objectManagerClusterize }, clusterOptions));
            for (let key in clusterCallbacks) {
                ObjectManager.clusters.events.add(key, clusterCallbacks[key]);
            }
            ObjectManager.add(clusters[clusterName]);
            map.geoObjects.add(ObjectManager);
        } else {
            const clusterer = new ymaps.Clusterer(clusterOptions);
            for (let key in clusterCallbacks) {
                clusterer.events.add(key, clusterCallbacks[key]);
            }
            clusterer.add(clusters[clusterName]);
            map.geoObjects.add(clusterer);
        }
    }
    if (unclastered.length) {
        const unclasteredMarkers = useObjectManager ? new ymaps.ObjectManager({ clusterize: false }) : new ymaps.GeoObjectCollection();
        unclastered.forEach(obj => unclasteredMarkers.add(obj))        
        map.geoObjects.add(unclasteredMarkers);
    }
}

export function getIconPreset(marker) {
    let firstPart = marker.icon.color || 'blue',
        secondPart;
    if (marker.icon.glyph) {
        secondPart = setFirstLetterToUppercase(marker.icon.glyph);
    } else if (marker.icon.content) {
        secondPart = 'Stretchy'
    } else {
        secondPart = ''
    }
    return firstPart + secondPart
}

export function setFirstLetterToUppercase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function setCoordsToNumeric(arr) {
    return arr.map(item => {
        return Array.isArray(item) ? setCoordsToNumeric(item) : +item;
    })
}

export function objectComparison( first, second ){
	
	let cache = []; //кеш обьектов, для избежания рекурсии
	
	function inCache( first, second ){
		var i = cache.length;
		while(i--) if( 
			( cache[i][0] === first || cache[i][0] === second) && (cache[i][1] === second  || cache[i][1] === first ) 
		) return true;
		return false
	}
	
	return function eq(f, s){
		if ( f === s ) return true; //сравниваем обычным образом
		if ( f instanceof Date && s instanceof Date ) return +f === +s; //время
		if ( typeof f !== 'object' || typeof s !== 'object' ) return false; //если хотябы один из аргументов не объект (положительный случай для необъектов рассмотрен выше)
		if( inCache(f, s) ) return true; //есть в кеше
		cache.push( [f , s] ); //кешируем
		
		var keys = Object.keys(f), i = keys.length; //получаем ключи
		if (Object.keys(s).length !== i ) return false; //если количество ключей не совпадает
		while(i--) if( !eq(f[keys[i]], s[keys[i]]) ) return false; //рекурсивный вызов
		
		return true
	}(first, second)
}

export function compareValues (newVal, oldVal, bus) {
    if (objectComparison(newVal, oldVal)) { return; } 
    if (bus.rerender) { clearTimeout(bus.rerender); }
    bus.rerender = setTimeout(() => bus.initMap && bus.initMap(), 10);
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
    'zoomControl'
];

export function controlsTypeValidator(val) {
    return val.filter(control => ![...CONTROL_TYPES, 'default'].includes(control)).length === 0
}

export function createMarkerType(val, useObjectManager) {
    const type = setFirstLetterToUppercase(val);
    if (!useObjectManager) return type;
    switch(type) {
        case 'Placemark': 
            return 'Point';
        case 'Polyline': 
            return 'LineString';
        default:
            return type;
    }
}

export function createMarker(object, useObjectManager) {
    let marker = useObjectManager ? {
        type: 'Feature',
        id: object.properties.markerId,
        geometry: {
            type: object.markerType,
            coordinates: object.coords
        },
        properties: object.properties,
        options: object.options
    } : new ymaps[object.markerType](object.coords, object.properties, object.options);

    marker.clusterName = object.clusterName;
    
    if (!useObjectManager) createCallbacks(object.callbacks, marker);

    return marker;
}
    