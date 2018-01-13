import * as utils from './utils';

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
            default: () => ({})
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
        placemarks: {
            type: Array,
            default() {
                return [];
            }
        }
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
                let balloonOptions = {};

                if (props.balloonTemplate) {
                    const BalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(props.balloonTemplate);
                    balloonOptions = { balloonContentLayout: BalloonContentLayoutClass }
                }

                let marker = {
                    markerId: props.markerId,
                    markerType: props.markerType,
                    coords: utils.setCoordsToNumeric(props.coords),
                    hintContent: props.hintContent,
                    markerFill: props.markerFill,
                    circleRadius: +props.circleRadius,
                    clusterName: props.clusterName,
                    markerStroke: props.markerStroke,
                    balloon: props.balloon, 
                    balloonOptions
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
                const m = myMarkers[i];
                const markerType = utils.setFirstLetterToUppercase(m.markerType);
                let properties = {
                    hintContent: m.hintContent,
                    iconContent: m.icon && m.icon.content,
                };

                const balloonProps = m.balloon ? {
                    balloonContentHeader: m.balloon.header,
                    balloonContentBody: m.balloon.body,
                    balloonContentFooter: m.balloon.footer,
                } : {};

                properties = Object.assign(properties, balloonProps);

                let options = m.iconLayout ? {
                    iconLayout: m.iconLayout,
                    iconImageHref: m.iconImageHref,
                    iconImageSize: m.iconImageSize,
                    iconImageOffset: m.iconImageOffset
                } : { preset: m.icon && `islands#${utils.getIconPreset(m)}Icon` };                

                const strokeOptions = m.markerStroke ? {
                    strokeColor: m.markerStroke.color || "0066ffff",
                    strokeOpacity: parseFloat(m.markerStroke.opacity) >= 0 ? parseFloat(m.markerStroke.opacity) : 1,
                    strokeStyle: m.markerStroke.style,
                    strokeWidth: parseFloat(m.markerStroke.width) >= 0 ? parseFloat(m.markerStroke.width) : 1
                } : {};

                const fillOptions = m.markerFill ? {
                    fill: m.markerFill.enabled || true,
                    fillColor: m.markerFill.color || "0066ff99",
                    fillOpacity: parseFloat(m.markerFill.opacity) >= 0 ? parseFloat(m.markerFill.opacity) : 1,
                    fillImageHref: m.markerFill.imageHref || ''
                } : {};

                options = Object.assign(options, strokeOptions, fillOptions, m.balloonOptions);

                if (markerType === 'Circle') {
                    m.coords = [m.coords, m.circleRadius];
                }
                let marker = new ymaps[markerType](m.coords, properties, options);
                utils.createCallbacks(m, marker);
                marker.clusterName = m.clusterName;

                marker.properties.set('markerId', m.markerId);

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
            this.$emit('map-was-initialized', this.myMap);
        }
    },
    watch: {
        coordinates(newVal) {
            this.myMap.setCenter && this.myMap.setCenter(newVal, this.zoom)
        },
        placemarks(newVal, oldVal) {
            if (window.ymaps) {
                this.myMap.destroy && this.myMap.destroy();
                this.init();
            }
        }
    },
    render(h) {
        return h(
            'section', 
            { class: 'ymap-container' },
            [
                h(
                    'div', 
                    {
                        attrs: {
                            id: this.ymapId,
                            class: 'ymap-body'
                        }
                    } 
                ),
                this.$slots.default 
            ]
        )
    },
    beforeMount() {
        if (!this.$ymapEventBus) {
            const Vue = this.$root.constructor;
            this.$ymapEventBus = new Vue({
                data: {
                    ymapReady: !!window && !!window.ymaps,
                    scriptIsNotAttached: window && !window.ymaps
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
