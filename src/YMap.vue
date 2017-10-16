<template>
    <section class="ymap-container">
        <div :id="ymapId" :style="{ width: '100%', height: '100%' }"></div>
        <slot></slot>
    </section>
</template>

<script>
import Vue from 'vue';
import * as utils from './utils'

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
    methods: {
        init() {
            let markers = [];
            let myGeoObjects = new ymaps.GeoObjectCollection();

            this.myMap = new ymaps.Map(this.ymapId, {
                center: this.coordinates,
                zoom: +this.zoom,
                behaviors: this.behaviors,
                controls: this.controls,
                type: `yandex#${this.mapType}`
            });
            if (this.zoomControl) {
                this.myMap.controls.remove('zoomControl');
                this.myMap.controls.add(new ymaps.control.ZoomControl(this.zoomControl));
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
                    coords: utils.setCoordsToNumeric(props.coords),
                    hintContent: props.hintContent,
                    markerFill: props.markerFill,
                    circleRadius: +props.circleRadius,
                    clusterName: props.clusterName,
                    markerStroke: props.markerStroke,
                    balloon: props.balloon
                };

                if (props.icon && props.icon.layout === 'default#image') {
                    marker.iconLayout = props.icon.layout;
                    marker.iconImageHref = props.icon.imageHref;
                    marker.iconImageSize = props.icon.imageSize;
                    marker.iconImageOffset = props.icon.imageOffset;
                    //                        marker.balloonLayout = "default#imageWithContent";
                } else {
                    marker.icon = props.icon;
                }
                if (props.callbacks) {
                    marker.callbacks = props.callbacks
                }
                if (props.data) {
                    marker.data = props.data
                }
                return marker
            }).filter(marker => marker && marker.markerType) || [];

            for (let i = 0; i < myMarkers.length; i++) {
                const markerType = utils.setFirstLetterToUppercase(myMarkers[i].markerType);
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
                        preset: myMarkers[i].icon && `islands#${utils.getIconPreset(myMarkers[i])}Icon`,
                        strokeColor: myMarkers[i].markerStroke && myMarkers[i].markerStroke.color || "0066ffff",
                        strokeOpacity: myMarkers[i].markerStroke && parseFloat(myMarkers[i].markerStroke.opacity) >= 0 || 1,
                        strokeStyle: myMarkers[i].markerStroke && myMarkers[i].markerStroke.style,
                        strokeWidth: myMarkers[i].markerStroke && parseFloat(myMarkers[i].markerStroke.width) >= 0 || 1,
                        fill: myMarkers[i].markerFill && myMarkers[i].markerFill.enabled || true,
                        fillColor: myMarkers[i].markerFill && myMarkers[i].markerFill.color || "0066ff99",
                        fillOpacity: myMarkers[i].markerFill && parseFloat(myMarkers[i].markerFill.opacity) >= 0 || 1,
                        fillImageHref: myMarkers[i].markerFill && myMarkers[i].markerFill.imageHref || ''
                    };
                }

                if (markerType === 'Circle') {
                    myMarkers[i].coords = [myMarkers[i].coords, myMarkers[i].circleRadius];
                }
                let marker = new ymaps[markerType](myMarkers[i].coords, properties, options);
                utils.createCallbacks(myMarkers[i], marker);
                marker.id = myMarkers[i].markerId;
                marker.clusterName = myMarkers[i].clusterName;
                marker.properties.set('markerId', i);

                markers.push(marker);
                myGeoObjects.add(marker);
            }

            if (this.placemarks) {
                this.placemarks.forEach(function(placemark) {
                    let yplacemark = new ymaps.Placemark (
                        placemark.coords,
                        placemark.properties || {},
                        placemark.options || {}
                    );

                    utils.createCallbacks(placemark, yplacemark);

                    if (placemark.clusterName) { 
                        yplacemark.clusterName = placemark.clusterName;
                        markers.push(yplacemark);
                    }
                    
                    myGeoObjects.add(yplacemark);
                })
            }

            this.myMap.geoObjects.add(myGeoObjects);

            utils.createClusters(markers, this.clusterOptions, this.myMap);
        }
    },
    watch: {
        coordinates(newVal) {
            this.myMap.setCenter && this.myMap.setCenter(newVal, this.zoom)
        },
        placemarks() {
            if (window.ymaps) {
                this.myMap.destroy && this.myMap.destroy();
                this.init();
            }
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
        if (this.$ymapEventBus.ymapReady) {
            ymaps.ready(this.init);
        } else {
            this.$ymapEventBus.$on('scriptIsLoaded', () => {
                this.$ymapEventBus.initMap = () => {
                    this.myMap.destroy();
                    this.init();
                };
                ymaps.ready(this.init);
            })
        }
    }
}
</script>
