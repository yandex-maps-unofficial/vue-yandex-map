<template>
    <div :id=ymapId></div>
</template>

<script>
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
            hintContent: String,
            balloonContent: String
        },
        computed: {
            coords() {
                return [this.latitude, this.longtitude]
            }
        },
        beforeCreate() {
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
                        zoom: 18
                    });

                    myPlacemark = new ymaps.Placemark(this.coords, {
                        hintContent: this.hintContent,
                        balloonContent: this.balloonContent
                    });

                    myMap.geoObjects.add(myPlacemark);
                }
            })
        }
    }
</script>