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
            latitude: {
                type: Number,
                required: true
            },
            longtitude: {
                type: Number,
                required: true
            },
            zoom: {
                type: Number,
                default: 18
            },
            hintContent: String,
            balloon: {
                type: Object,
                default: () => ({})
            },
            icon: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            coords() {
                return [this.latitude, this.longtitude]
            },
            iconPreset() {
                let firstPart = this.icon.color || 'blue',
                    secondPart;
                if (this.icon.glyph) {
                    secondPart = this.icon.glyph.charAt(0).toUpperCase() + this.icon.glyph.slice(1);
                } else if (this.icon.content) {
                    secondPart = 'Stretchy'
                } else {
                    secondPart = ''
                }
                return firstPart + secondPart
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
                let myMap,
                    myPlacemark;

                if (this.$ymapEventBus.ymapReady) {
                    ymaps.ready(init.bind(this));
                } else {
                    this.$ymapEventBus.$on('scriptIsLoaded', () => {
                        ymaps.ready(init.bind(this));
                    })
                }

                function init() {
                    console.log(this.ymapId);
                    myMap = new ymaps.Map(this.ymapId, {
                        center: this.coords,
                        zoom: this.zoom
                    });

                    myPlacemark = new ymaps.Placemark(this.coords, {
                        hintContent: this.hintContent,
                        iconContent: this.icon.content,
                        balloonContentHeader: this.balloon.header,
                        balloonContentBody: this.balloon.body,
                        balloonContentFooter: this.balloon.footer
                    }, {
                        preset: `islands#${this.iconPreset}Icon`
                    });

                    myMap.geoObjects.add(myPlacemark);
                }
            })
        }
    }
</script>

<style lang="scss">
    .ymap-container {
        width: 100%;
        height: 100%;

        .ymap-body {
            width: 100%;
            height: 100%;
        }
    }
</style>
