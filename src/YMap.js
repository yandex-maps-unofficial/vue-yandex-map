import * as utils from './utils';

export default {
    data() {
        return {
            ymapEventBus: utils.emitter,
            ymapId: 'yandexMap' + Math.round(Math.random() * 100000),
            myMap: {},
            style: this.ymapClass ? '' : 'width: 100%; height: 100%;'
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
        clusterCallbacks: {
            type: Object,
            default: () => ({})
        },
        behaviors: {
            type: Array,
            default: () => ['default']
        },
        controls: {
            type: Array,
            default: () => ['default'],
            validator(val) {
                return utils.controlsTypeValidator(val);
            }
        },
        detailedControls: {
            type: Object,
            validator(val) {
                const controls = Object.keys(val);
                return utils.controlsTypeValidator(controls)
            }
        },
        scrollZoom: {
            type: Boolean,
            default: true
        },
        zoomControl: Object,
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
        },
        useObjectManager: {
            type: Boolean,
            default: false
        },
        objectManagerClusterize: {
            type: Boolean,
            default: true
        },
        ymapClass: String,
        initWithoutMarkers: {
            type: Boolean,
            default: true
        },
        mapLink: String
    },
    computed: {
        coordinates() {
            return this.coords.map(item => +item)
        },
    },
    methods: {
        init() {
            // if ymap isn't initialized or have no markers;
            if (!window.ymaps || !ymaps.GeoObjectCollection || (!this.initWithoutMarkers && !this.$slots.default && !this.placemarks.length)) return; 
            
            this.$emit('map-initialization-started');
            let markers = [];

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
                    callbacks: props.callbacks,
                    properties: props.properties,
                    options: props.options,
                    balloonOptions
                };

                if (props.icon && props.icon.layout === 'default#image') {
                    marker.iconLayout = props.icon.layout;
                    marker.iconImageHref = props.icon.imageHref;
                    marker.iconImageSize = props.icon.imageSize;
                    marker.iconImageOffset = props.icon.imageOffset;
                } else {
                    marker.icon = props.icon;
                }

                return marker;
            }).filter(marker => marker && marker.markerType) || [];
            
            for (let i = 0; i < myMarkers.length; i++) {
                const m = myMarkers[i];
                const markerType = utils.createMarkerType(m.markerType, this.useObjectManager);
                const initialProps = {
                    hintContent: m.hintContent,
                    iconContent: m.icon && m.icon.content,
                    markerId: m.markerId
                };

                const balloonProps = m.balloon ? {
                    balloonContentHeader: m.balloon.header,
                    balloonContentBody: m.balloon.body,
                    balloonContentFooter: m.balloon.footer,
                } : {};

                const properties = Object.assign(initialProps, balloonProps, m.properties);

                const iconOptions = m.iconLayout ? {
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

                const options = Object.assign(iconOptions, strokeOptions, fillOptions, m.balloonOptions, m.options);

                if (markerType === 'Circle') {
                    m.coords = [m.coords, m.circleRadius];
                }

                const obj = { properties, options, markerType, coords: m.coords, clusterName: m.clusterName, callbacks: m.callbacks }
                const marker = utils.createMarker(obj, this.useObjectManager);

                markers.push(marker);
            }

            if (this.placemarks) {
                const markerType = this.useObjectManager ? 'Point' : 'Placemark';
                this.placemarks.forEach(placemark => {
                    const { properties, options = {}, coords, clusterName, callbacks, balloonTemplate } = placemark;
                    if (balloonTemplate) {
                        const BalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(balloonTemplate);
                        options.balloonContentLayout = BalloonContentLayoutClass;
                    }
                    const obj = { properties, options, markerType, coords, clusterName, callbacks }
                    let yplacemark = utils.createMarker(obj, this.useObjectManager);
                    
                    markers.push(yplacemark);
                })
            }

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
            if (this.detailedControls) {
                const controls = Object.keys(this.detailedControls);
                controls.forEach(controlName => {
                    this.myMap.controls.remove(controlName);
                    this.myMap.controls.add(controlName, this.detailedControls[controlName]);
                })
            }
            if (this.scrollZoom === false) {
                this.myMap.behaviors.disable('scrollZoom');
            }

            const config = {
                options: this.clusterOptions,
                callbacks: this.clusterCallbacks,
                map: this.myMap,
                useObjectManager: this.useObjectManager,
                objectManagerClusterize: this.objectManagerClusterize
            };
            utils.addToCart(markers, config);
            this.$emit('map-was-initialized', this.myMap);
        }
    },
    watch: {
        coordinates(newVal) {
            this.myMap.panTo && this.myMap.panTo(newVal)
        },
        placemarks() {
            if (window.ymaps) {
                this.myMap.destroy && this.myMap.destroy();
                this.init();
            }
        },
        zoom() {
            this.myMap.setZoom(this.zoom);
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
                            class: this.ymapClass,
                            style: this.style
                        }
                    }
                ),
                h(
                    'div',
                    {
                        attrs: {
                            class: 'ymap-markers'
                        }
                    },
                    [
                        this.$slots.default
                    ]
                ) 
            ]
        )
    },
    mounted() {
        this.observer = new MutationObserver(function(mutations) {
            this.myMap.destroy && this.myMap.destroy();
            this.init();
        }.bind(this));
        
        // Setup the observer
        this.observer.observe(
            document.querySelector('.ymap-markers'),
            { attributes: true, childList: true, characterData: true, subtree: true }
        );

        if (this.ymapEventBus.scriptIsNotAttached) {
            const yandexMapScript = document.createElement('SCRIPT');
            const mapLink = this.mapLink || 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
            yandexMapScript.setAttribute('src', mapLink);
            yandexMapScript.setAttribute('async', '');
            yandexMapScript.setAttribute('defer', '');
            document.body.appendChild(yandexMapScript);
            this.ymapEventBus.scriptIsNotAttached = false;
            yandexMapScript.onload = () => {
                this.ymapEventBus.ymapReady = true;
                this.ymapEventBus.$emit('scriptIsLoaded');
            }
        }
        if (this.ymapEventBus.ymapReady) {
            ymaps.ready(this.init);
        } else {
            this.ymapEventBus.$on('scriptIsLoaded', () => {
                this.ymapEventBus.initMap = () => {
                    this.myMap.destroy();
                    this.init();
                };
                ymaps.ready(this.init);
            })
        }
    },
    beforeDestroy() {
        this.myMap.geoObjects && this.myMap.geoObjects.removeAll();
        this.observer.disconnect();
    }
}
