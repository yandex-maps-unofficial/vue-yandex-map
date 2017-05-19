<template>
    <div id="yandexMap"></div>
</template>

<script>
    export default {
        props: {
            latitude: {
                type: String,
                required: true
            },
            longtitude: {
                type: String,
                required: true
            }
        },
        computed: {
            coords() {
                return [+this.latitude, +this.longtitude]
            }
        },
        beforeCreate() {
            const yandexMapScript = document.createElement('SCRIPT');
            yandexMapScript.setAttribute('src', 'https://api-maps.yandex.ru/2.1/?lang=ru_RU');
            yandexMapScript.setAttribute('async', '');
            yandexMapScript.setAttribute('defer', '');
            document.body.appendChild(yandexMapScript);
            yandexMapScript.onload = () => {
                ymaps.ready(init.bind(this));
                let myMap,
                    myPlacemark;

                function init() {
                    console.log(this.coords);
                    myMap = new ymaps.Map("yandexMap", {
                        center: this.coords,
                        zoom: 18
                    });

                    myPlacemark = new ymaps.Placemark(this.coords, {
                        hintContent: 'Тату-студия «РЗН Тату»',
                        balloonContent: 'Тату-студия «РЗН Тату». +7 (960) 575-29-50'
                    });

                    myMap.geoObjects.add(myPlacemark);
                }
            };
        }
    }
</script>