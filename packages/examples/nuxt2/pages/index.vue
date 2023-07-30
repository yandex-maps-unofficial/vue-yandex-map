<script lang="ts">
import { defineComponent } from 'vue';
import {
  YMap, YMapDefaultSchemeLayer, YMapListener, YMapMarker, YMapDefaultFeaturesLayer, YMapControls, YMapGeolocationControl, YMapZoomControl,
} from 'vue-yandex-maps';

export default defineComponent({
  components: {
    YMapMarker,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapListener,
    YMap,
    YMapControls,
    YMapGeolocationControl,
    YMapZoomControl,
  },
  data() {
    return {
      markerValue: 'Кликни - и я изменюсь',
    };
  },
  methods: {
    test() {
      this.markerValue = 'Изменился!';
    },
  },
});
</script>

<template>
  <y-map width="50dvw" height="75dvh" :settings="{ location: { center: [37.588144, 55.733842], zoom: 7 } }">
    <y-map-listener :settings="{ onClick: test }" />
    <y-map-default-scheme-layer :settings="{ theme: 'dark' }" />
    <y-map-default-features-layer />
    <y-map-marker :settings="{ coordinates: [37.588144, 55.733842] }">
      <span style="color: #fff">
        {{ markerValue }}
      </span>
    </y-map-marker>
    <y-map-controls :settings="{ position: 'top left', orientation: 'vertical' }">
      <y-map-geolocation-control />
      <y-map-zoom-control />
    </y-map-controls>
    <y-map-controls :settings="{ position: 'top right', orientation: 'horizontal' }">
      <y-map-geolocation-control />
      <y-map-zoom-control />
    </y-map-controls>
  </y-map>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
}

#app {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
