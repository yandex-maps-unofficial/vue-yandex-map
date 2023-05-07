<template>
  <slot />
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import {
  BehaviorEvents, DomEvents, MapEvents, NullablePartial,
} from '@yandex/ymaps3-types';

const props = defineProps<Partial<DomEvents> & NullablePartial<MapEvents> & NullablePartial<BehaviorEvents>>();

const mapListener = new ymaps3.YMapListener(props);

watch(props, () => {
  mapListener.update(props);
}, {
  deep: true,
});
</script>
