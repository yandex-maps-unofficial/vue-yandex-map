<script lang="ts">
import { defineComponent } from 'vue';
import { YMap, YMapDefaultSchemeLayer, YMapListener } from 'vue-yandex-maps';

export default defineComponent({
  components: {
    YMapDefaultSchemeLayer,
    YMapListener,
    YMap,
  },
  methods: {
    test() {
      // eslint-disable-next-line no-alert
      alert('Click!');
    },
  },
});
</script>

<template>
  <div id="app">
      <y-map width="50dvw" height="75dvh" :settings="{ location: { center: [37.588144, 55.733842], zoom: 7 } }">
      <y-map-listener :settings="{ onClick: test }" />
      <y-map-default-scheme-layer :settings="{ theme: 'dark' }" />
    </y-map>
  </div>
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
