<script lang="ts">
import { defineComponent } from 'vue';
import ExampleComponent from 'example-vue3/src/example-component.vue';

export default defineComponent({
  components: {
    ExampleComponent,
  },
});
</script>

<template>
  <example-component />
</template>
