<template>
  <slot />
</template>

<script lang="ts" setup>
import { YMapLayer } from '@yandex/ymaps3-types';
import { onMounted, watch } from 'vue-demi';
import {
  insertLayerIntoMap,
} from '../../composables/utils';

const props = defineProps<{settings: ConstructorParameters<typeof YMapLayer>[0]}>();

let mapLayer: YMapLayer | undefined;

watch(props, () => {
  mapLayer?.update(props.settings);
}, {
  deep: true,
});

onMounted(async () => {
  mapLayer = await insertLayerIntoMap(() => new ymaps3.YMapLayer(props.settings));
});
</script>
