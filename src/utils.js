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