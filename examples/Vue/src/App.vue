<template>
    <div id="app">
        <yandex-map v-if="coords" :coords="coords" :zoom="12" @click="onClick">
            <ymap-marker
                marker-id="123"
                :coords="coords"
                :balloon-template="balloonTemplate"
            ></ymap-marker>
        </yandex-map>
    </div>
</template>

<script>
    export default {
        data: () => ({
            coords: null,
        }),
        computed: {
            balloonTemplate() {
                return `
        <h1 class="red">Hi, everyone!</h1>
        <p>I am here: ${this.coords}</p>
        <img src="http://via.placeholder.com/350x150">
      `
            }
        },
        methods: {
            onClick(e) {
                this.coords = e.get('coords');
            }
        },
        mounted() {
            this.$yMapLoad.yMapLoad()
                .then(ymaps => {
                    ymaps.geocode(`Москва, Красная площадь, 3`)
                        .then(res => {
                            const firstResult = res.geoObjects.get(0);
                            this.coords = firstResult.geometry.getCoordinates();
                        });
                })
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    .ymap-container {
        height: 600px;
    }

    .red {
        color: red;
    }
</style>
