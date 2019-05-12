<template>
  <div id="app">
    <yandex-map :coords="coords" class="map" @click="onClick">
      <ymap-marker markerId="123" marker-type="placemark" hint-content="element.hint" :coords="coords"></ymap-marker>
    </yandex-map>
  </div>
</template>

<script>
import { yandexMap, ymapMarker } from 'vue-yandex-maps';

export default {
  name: 'app',
  components: {
    yandexMap,
    ymapMarker
  },
  data: () => ({
    coords: [54, 39]
  }),
  methods: {
    onClick(e) {
      this.coords = e.get('coords');
    }
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
</style>
