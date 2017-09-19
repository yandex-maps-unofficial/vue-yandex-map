<template>
    <section class="ymap-container">
        <div :id="ymapId" :style="{ width: '100%', height: '100%' }"></div>
        <slot></slot>
    </section>
</template>

<script>
import Vue from 'vue';

export default {
    data() {
        return {
            ymapId: 'yandexMap' + Math.round(Math.random() * 100000),
            myMap: {}
        }
    },
    props: {
        coords: {
            type: Array,
            validator(val) {
                return !val.filter(item => isNaN(item)).length
            },
            required: true
        },
        zoom: {
            validator(val) {
                return !isNaN(val)
            },
            default: 18
        },
        clusterOptions: {
            type: Object,
            default: () => ({})
        },
        behaviors: {
            type: Array,
            default: () => ['default']
        },
        controls: {
            type: Array,
            default: () => ['default']
        },
        scrollZoom: {
            type: Boolean
        },
        zoomControl: {
            type: Object,
            //              default: () => ({})
        },
        zoomControlPosition: {
            type: Object,
            default: () => ({})
        },
        mapType: {
            type: String,
            default: 'map',
            validator(val) {
                return ['map', 'satellite', 'hybrid'].includes(val)
            }
        },
        placemarks: Array
    },
    computed: {
        coordinates() {
            return this.coords.map(item => +item)
        }
    },
    watch: {
        coordinates(newVal) {
            this.myMap.setCenter && this.myMap.setCenter(newVal, this.zoom)
        }
    },
    beforeMount() {
        if (!this.$ymapEventBus) {
            this.$ymapEventBus = new Vue({
                data: {
                    ymapReady: false,
                    scriptIsNotAttached: true
                }
            });
        }
        if (this.$ymapEventBus.scriptIsNotAttached) {
            const yandexMapScript = document.createElement('SCRIPT');
            yandexMapScript.setAttribute('src', 'https://api-maps.yandex.ru/2.1/?lang=ru_RU');
            yandexMapScript.setAttribute('async', '');
            yandexMapScript.setAttribute('defer', '');
            document.body.appendChild(yandexMapScript);
            this.$ymapEventBus.scriptIsNotAttached = false;
            yandexMapScript.onload = () => {
                this.$ymapEventBus.ymapReady = true;
                this.$ymapEventBus.$emit('scriptIsLoaded');
            }
        } else {
            return false;
        }
    },
    mounted() {
        let markers = [];

        if (this.$ymapEventBus.ymapReady) {
            ymaps.ready(init.bind(this));
        } else {
            this.$ymapEventBus.$on('scriptIsLoaded', () => {
                ymaps.ready(init.bind(this));
            })
        }

        function init() {
            let myGeoObjects = new ymaps.GeoObjectCollection();

            this.myMap = new ymaps.Map(this.ymapId, {
                center: this.coordinates,
                zoom: +this.zoom,
                behaviors: this.behaviors,
                controls: this.controls,
                type: `yandex#${this.mapType}`
            });
            if (this.zoomControl) {
                this.myMap.controls.add(new ymaps.control.ZoomControl(this.zoomControl), this.zoomControlPosition);
            }
            if (this.scrollZoom === false) {
                this.myMap.behaviors.disable('scrollZoom');
            }
            const myMarkers = this.$slots.default && this.$slots.default.map(m => {
                const props = m.componentOptions && m.componentOptions.propsData;
                if (!props) return;

                let marker = {
                    markerId: props.markerId,
                    markerType: props.markerType,
                    coords: setCoordsToNumeric(props.coords),
                    hintContent: props.hintContent,
                    markerFill: props.markerFill,
                    circleRadius: +props.circleRadius,
                    clusterName: props.clusterName
                };

                if (props.icon && props.icon.layout === 'default#image') {
                    marker.iconLayout = props.icon.layout;
                    marker.iconImageHref = props.icon.imageHref;
                    marker.iconImageSize = props.icon.imageSize;
                    marker.iconImageOffset = props.icon.imageOffset;
                    //                        marker.balloonLayout = "default#imageWithContent";
                } else {
                    marker.icon = props.icon;
                    marker.balloon = props.balloon;
                    marker.markerStroke = props.markerStroke;
                }
                if (props.onClick) {
                    marker.onClick = props.onClick
                }
                if (props.data) {
                    marker.data = props.data
                }
                return marker
            }).filter(marker => marker && marker.markerType) || [];

            for (let i = 0; i < myMarkers.length; i++) {
                const markerType = setFirstLetterToUppercase(myMarkers[i].markerType);
                const properties = {
                    hintContent: myMarkers[i].hintContent,
                    balloonContentHeader: myMarkers[i].balloon && myMarkers[i].balloon.header,
                    balloonContentBody: myMarkers[i].balloon && myMarkers[i].balloon.body,
                    balloonContentFooter: myMarkers[i].balloon && myMarkers[i].balloon.footer,
                    iconContent: myMarkers[i].icon && myMarkers[i].icon.content,
                };
                let options;
                if (myMarkers[i].iconLayout) {
                    options = {
                        iconLayout: myMarkers[i].iconLayout,
                        iconImageHref: myMarkers[i].iconImageHref,
                        iconImageSize: myMarkers[i].iconImageSize,
                        iconImageOffset: myMarkers[i].iconImageOffset,
                    }
                } else {
                    options = {
                        preset: myMarkers[i].icon && `islands#${getIconPreset(myMarkers[i])}Icon`,
                        strokeColor: myMarkers[i].markerStroke && myMarkers[i].markerStroke.color || "0066ffff",
                        strokeOpacity: myMarkers[i].markerStroke && myMarkers[i].markerStroke.opacity || 1,
                        strokeStyle: myMarkers[i].markerStroke && myMarkers[i].markerStroke.style,
                        strokeWidth: myMarkers[i].markerStroke && myMarkers[i].markerStroke.width || 1,
                        fill: myMarkers[i].markerFill && myMarkers[i].markerFill.enabled || true,
                        fillColor: myMarkers[i].markerFill && myMarkers[i].markerFill.color || "0066ff99",
                        fillOpacity: myMarkers[i].markerFill && myMarkers[i].markerFill.opacity || 1
                    };
                }

                if (markerType === 'Circle') {
                    myMarkers[i].coords = [myMarkers[i].coords, myMarkers[i].circleRadius];
                }
                let marker = new ymaps[markerType](myMarkers[i].coords, properties, options);
                marker.id = myMarkers[i].markerId;
                marker.clusterName = myMarkers[i].clusterName;
                marker.properties.set('markerId', i);

                markers.push(marker);
                myGeoObjects.add(marker);
            }

            if (this.placemarks) {
                this.placemarks.forEach(function(placemark) {
                    let yplacemark =
                        new ymaps.Placemark(
                            placemark.coordinates,
                            placemark.properties || {},
                            placemark.options || {}
                        );

                    myGeoObjects.add(yplacemark);
                })
            }

            this.myMap.geoObjects.add(myGeoObjects);
            this.myMap.geoObjects.events.add('click', function(e) {
                const i = e.get('target').properties.get('markerId');
                if (myMarkers[i].onClick) {
                    myMarkers[i].onClick(myMarkers[i]);
                }
            });

            createClusters(markers, this.clusterOptions, this.myMap);
        }

        function createClusters(markers, options, map) {
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

        function getIconPreset(marker) {
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

        function setFirstLetterToUppercase(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function setCoordsToNumeric(arr) {
            return arr.map(item => {
                return Array.isArray(item) ? setCoordsToNumeric(item) : +item;
            })
        }
    }
}
</script>
