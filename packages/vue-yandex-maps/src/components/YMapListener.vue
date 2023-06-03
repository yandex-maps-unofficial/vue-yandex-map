<template>
  <slot />
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue-demi';
import {
  BehaviorEvents, DomEvents, MapEvents, YMapListener,
} from '@yandex/ymaps3-types';
import { injectMap, waitTillMapInit } from '../composables/utils';

const props = defineProps<{ settings?: Partial<DomEvents> & Partial<MapEvents> & Partial<BehaviorEvents> }>();
const map = injectMap();

let mapListener: YMapListener | undefined;

watch(props, () => {
  mapListener?.update(props.settings || {});
}, {
  deep: true,
});

onMounted(async () => {
  await waitTillMapInit();

  mapListener = new ymaps3.YMapListener(props.settings || {});
  map.value?.addChild(mapListener);
});
</script>
