<template>
  <slot />
</template>

<script lang="ts" setup>
import { YMapDefaultFeaturesLayer } from '@yandex/ymaps3-types';
import { onMounted, watch } from 'vue-demi';
import {
  insertLayerIntoMap,
} from '../../composables/utils';

const props = defineProps<{settings?: ConstructorParameters<typeof YMapDefaultFeaturesLayer>[0]}>();

let mapLayer: YMapDefaultFeaturesLayer | undefined;

watch(props, () => {
  mapLayer?.update(props.settings || {});
}, {
  deep: true,
});

onMounted(async () => {
  mapLayer = await insertLayerIntoMap(() => new ymaps3.YMapDefaultFeaturesLayer(props.settings || {}));
});
</script>
