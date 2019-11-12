<template>
  <div id="app">
    <div v-if="showMaps">
      <yandex-map
        ref="map1"
        :coords="coords"
        show-all-markers
        class="map basic"
        @map-was-initialized="onLoading($event, 1)"
        @markers-was-delete="checkDeleteMarkers('1', $event)"
        @markers-was-change="checkChangeMarkers('1', $event)"
      >
        <ymap-marker
          v-for="marker in markers"
          :key="marker.id"
          :marker-id="marker.id"
          :coords="marker.coords"
          :cluster-name="marker.clusterName"
        />
      </yandex-map>
      <div class="passed passedMap1">
        <label><input v-model="passedMap1" type="checkbox" value="loaded">loaded</label>
        <label><input v-model="passedMap1" type="checkbox" value="filtered">filtered</label>
        <label><input v-model="passedMap1" type="checkbox" value="edited">edited</label>
      </div>
      <yandex-map
        ref="map2"
        :coords="coords"
        show-all-markers
        class="map cluster"
        @map-was-initialized="onLoading($event, 2)"
        @markers-was-delete="checkDeleteMarkers('2', $event)"
        @markers-was-change="checkChangeMarkers('2', $event)"
      >
        <ymap-marker
          v-for="marker in markers"
          :key="marker.id"
          :marker-id="marker.id"
          :coords="marker.coords"
        />
      </yandex-map>
      <div class="passed passedMap2">
        <label><input v-model="passedMap2" type="checkbox" value="loaded">loaded</label>
        <label><input v-model="passedMap2" type="checkbox" value="filtered">filtered</label>
        <label><input v-model="passedMap2" type="checkbox" value="edited">edited</label>
      </div>
      <yandex-map
        ref="map3"
        :coords="coords"
        show-all-markers
        use-object-manager
        class="map object"
        @map-was-initialized="onLoading($event, 3)"
        @markers-was-delete="checkDeleteMarkers('3', $event)"
        @markers-was-change="checkChangeMarkers('3', $event)"
      >
        <ymap-marker
          v-for="marker in markers"
          :key="marker.id"
          :marker-id="marker.id"
          :coords="marker.coords"
          :cluster-name="marker.clusterName"
        />
      </yandex-map>
      <div class="passed passedMap3">
        <label><input v-model="passedMap3" type="checkbox" value="loaded">loaded</label>
        <label><input v-model="passedMap3" type="checkbox" value="filtered">filtered</label>
        <label><input v-model="passedMap3" type="checkbox" value="edited">edited</label>
      </div>
    </div>
    <button id="filterButton" @click="filterMarkers">
      Filter markers
    </button>
    <button id="changeButton" @click="changeMarkers">
      Change markers
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
    passedMap1: [],
    passedMap2: [],
    passedMap3: [],
    myMap1: {},
    myMap2: {},
    myMap3: {},
  }),
  async created() {
    await loadYmap();
    if (window.ymaps) this.showMaps = true;
  },
  methods: {
    onLoading(map, mapNumber) {
      this[`myMap${mapNumber}`] = map;
      this[`passedMap${mapNumber}`].push('loaded');
    },
    filterMarkers() {
      this.markers = this.markers.filter(_ => _.clusterName > 1);
    },
    changeMarkers() {
      this.markers.splice(0, 1, { ...this.markers[0], coords: [34, 55] });
    },
    checkLength(mapNumber) {
      let length = 0;
      this.$refs[`map${mapNumber}`].myMap.geoObjects.each((_) => {
        length
          += (_.getLength && _.getLength())
          || (_.getGeoObjects && _.getGeoObjects().length)
          || (_.objects && _.objects.getLength());
      });
      return length;
    },
    checkDeleteMarkers(mapNumber) {
      const length = this.checkLength(mapNumber);
      if (length === this.markers.length) this[`passedMap${mapNumber}`].push('filtered');
    },
    checkChangeMarkers(mapNumber) {
      const map = this[`myMap${mapNumber}`];
      map.setBounds(map.geoObjects.getBounds());
      const length = this.checkLength(mapNumber);
      if (length === this.markers.length) this[`passedMap${mapNumber}`].push('edited');
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
  margin-bottom: 10px;
}

.passed {
  margin-bottom: 60px;
}

.passed label {
  margin-right: 20px;
}
</style>
