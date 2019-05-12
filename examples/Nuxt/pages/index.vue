<template>
  <section class="container">
    <div v-if="isMounted">
      <yandex-map :coords="[54, 39]" class="map">
        <ymap-marker markerId="123" marker-type="placemark" hint-content="element.hint" :coords="[54, 39]"></ymap-marker>
      </yandex-map>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  data: () => ({
    isMounted: false
  }),
  mounted() {
    this.isMounted = true;
  }
}
</script>

<style>
.ymap-container {
  height: 600px;
}
</style>
