<script lang="ts">
import { defineComponent } from 'vue';
import {
  YandexMap,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapDefaultSatelliteLayer,
  YandexMapGeolocationControl,
  YandexMapListener,
  YandexMapMarker,
  YandexMapZoomControl,
} from 'vue-yandex-maps';

export default defineComponent({
  components: {
    YandexMapMarker,
    YandexMapDefaultSchemeLayer,
    YandexMapDefaultFeaturesLayer,
    YandexMapListener,
    YandexMap,
    YandexMapControls,
    YandexMapGeolocationControl,
    YandexMapDefaultSatelliteLayer,
    YandexMapZoomControl,
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
  <div id="__app" :key="markerValue">
    <yandex-map width="50dvw" height="75dvh" :settings="{ location: { center: [37.588144, 55.733842], zoom: 7 } }">
      <yandex-map-listener :settings="{ onClick: test }" />
      <yandex-map-default-satellite-layer />
      <yandex-map-default-scheme-layer :settings="{ theme: 'dark' }" />
      <yandex-map-default-features-layer />
      <yandex-map-marker :settings="{ coordinates: [37.588144, 55.733842] }">
        <span style="color: #fff">
          {{ markerValue }}
        </span>
      </yandex-map-marker>
      <yandex-map-controls :settings="{ position: 'top left', orientation: 'vertical' }">
        <yandex-map-geolocation-control />
        <yandex-map-zoom-control />
      </yandex-map-controls>
      <yandex-map-controls :settings="{ position: 'top right', orientation: 'horizontal' }">
        <yandex-map-geolocation-control />
        <yandex-map-zoom-control />
      </yandex-map-controls>
    </yandex-map>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
}

#__app {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
