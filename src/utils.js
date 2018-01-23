export function createCallbacks(marker, placemark) {
    if (marker.callbacks && typeof marker.callbacks === 'object') {
        for (let key in marker.callbacks) {
            placemark.events.add(key, marker.callbacks[key]);
        }
    }
}

export function createClusters(markers, options, map) {
    let clusters = {};
    for (let marker of markers) {
        if (!marker.clusterName) continue;
        clusters[marker.clusterName] = clusters[marker.clusterName] ? [...clusters[marker.clusterName], marker] : [marker];
    }
    for (let clusterName in clusters) {
        const clusterOptions = options[clusterName] || {};
        const clusterer = new ymaps.Clusterer(clusterOptions);
        clusterer.add(clusters[clusterName]);
        map.geoObjects.add(clusterer);
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
    