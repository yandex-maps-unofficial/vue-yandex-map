<template>
  <slot />
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue-demi';
import {
  BehaviorEvents, DomEvents, MapEvents, YMapListener,
} from '@yandex/ymaps3-types';
import { injectMap, waitTillMapInit } from '../composables/utils';

const props = defineProps<Partial<DomEvents> & MapEvents & BehaviorEvents>();
const map = injectMap();

let mapListener: YMapListener | undefined;

watch(props, () => {
  mapListener?.update(props);
}, {
  deep: true,
});

onMounted(async () => {
  console.log('Map init wait');
  await waitTillMapInit();

  console.log('Listener registered', mapListener);
  mapListener = new ymaps3.YMapListener(props);
  map.value?.addChild(mapListener);
});
</script>
