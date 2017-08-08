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
                ymapId: 'yandexMap' + Math.round(Math.random()*100000)
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
            }
        },
        computed: {
            coordinates() {
                return this.coords.map(item => +item)
            }
        },
        beforeCreate() {
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
        created() {
	        window.addEventListener('DOMContentLoaded', () => {
                let myMap;

                if (this.$ymapEventBus.ymapReady) {
                    ymaps.ready(init.bind(this));
                } else {
                    this.$ymapEventBus.$on('scriptIsLoaded', () => {
                        ymaps.ready(init.bind(this));
                    })
                }

                function init() {
                    myMap = new ymaps.Map(this.ymapId, {
                        center: this.coordinates,
                        zoom: +this.zoom
                    });

                    const myMarkers = this.$slots.default && this.$slots.default.map(marker => {
                        const props = marker.componentOptions && marker.componentOptions.propsData;
                        if (!props) return;
                        return {
                            markerType: props.markerType,
                            coords: setCoordsToNumeric(props.coords),
                            hintContent: props.hintContent,
                            icon: props.icon,
                            balloon: props.balloon,
                            markerStroke: props.markerStroke,
                            markerFill: props.markerFill,
                            circleRadius: +props.circleRadius
                        }
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
                        const options = {
                            preset: myMarkers[i].icon && `islands#${getIconPreset(myMarkers[i])}Icon`,
                            strokeColor: myMarkers[i].markerStroke && myMarkers[i].markerStroke.color || "0066ffff",
                            strokeOpacity: myMarkers[i].markerStroke && myMarkers[i].markerStroke.opacity || 1,
                            strokeStyle: myMarkers[i].markerStroke && myMarkers[i].markerStroke.style,
                            strokeWidth: myMarkers[i].markerStroke && myMarkers[i].markerStroke.width || 1,
                            fill: myMarkers[i].markerFill && myMarkers[i].markerFill.enabled || true,
                            fillColor: myMarkers[i].markerFill && myMarkers[i].markerFill.color || "0066ff99",
                            fillOpacity: myMarkers[i].markerFill && myMarkers[i].markerFill.opacity || 1
                        };
                        if (markerType === 'Circle') {
                            myMarkers[i].coords = [myMarkers[i].coords, myMarkers[i].circleRadius];
                        }
                        const marker = new ymaps[markerType](myMarkers[i].coords, properties, options);
                        myMap.geoObjects.add(marker);
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
            })
        }
    }
</script>
