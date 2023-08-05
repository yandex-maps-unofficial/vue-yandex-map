<script lang="ts">
import { defineComponent } from 'vue';
import ExampleComponent from './example-component.vue';

export default defineComponent({
  components: {
    ExampleComponent,
  },
});
</script>

<template>
  <example-component />
</template>
