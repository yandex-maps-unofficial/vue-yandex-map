<template>
  <div id="app">
    <div v-if="showMaps">
      <yandex-map :coords="coords" show-all-markers class="map basic">
        <ymap-marker
          v-for="marker in markers"
          :key="marker.id"
          :marker-id="marker.id"
          :coords="marker.coords"
          :cluster-name="marker.clusterName"
        />
      </yandex-map>
      <yandex-map :coords="coords" show-all-markers class="map cluster">
        <ymap-marker
          v-for="marker in markers"
          :key="marker.id"
          :marker-id="marker.id"
          :coords="marker.coords"
        />
      </yandex-map>
      <yandex-map :coords="coords" show-all-markers use-object-manager class="map object">
        <ymap-marker
          v-for="marker in markers"
          :key="marker.id"
          :marker-id="marker.id"
          :coords="marker.coords"
          :cluster-name="marker.clusterName"
        />
      </yandex-map>
    </div>
    <button @click="filterMarkers">
      Filter markers
    </button>
  </div>
</template>

<script>
import { loadYmap, yandexMap, ymapMarker } from '../../../src';

const markers = require('./markers.json');

export default {
  name: 'App',
  components: {
    yandexMap,
    ymapMarker,
  },
  data: () => ({
    coords: [34, 34],
    showMaps: false,
    markers,
  }),
  async created() {
    await loadYmap();
    if (window.ymaps) this.showMaps = true;
  },
  methods: {
    filterMarkers() {
      this.markers = this.markers.filter(_ => _.clusterName > 1);
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 600px;
}

.ymap-container {
  height: 600px;
  margin-bottom: 50px;
}
</style>
