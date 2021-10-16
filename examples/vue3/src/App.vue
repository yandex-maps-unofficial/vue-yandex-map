<template>
  <yandex-map :coords="coords">
      <ymap-marker 
        marker-id="123" 
        :coords="coords"
        :marker-events="['click']"
      ></ymap-marker>
    </yandex-map>
</template>

<script>
export default {
  name: 'App',
  setup() {
    return {
      coords: [54, 39],
    }
  }
}
</script>

<style>
.ymap-container {
  height: 600px;
}
</style>
