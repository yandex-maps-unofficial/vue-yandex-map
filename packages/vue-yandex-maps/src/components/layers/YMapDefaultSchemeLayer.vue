<template>
  <slot />
</template>

<script lang="ts" setup>
import { YMapDefaultSchemeLayer } from '@yandex/ymaps3-types';
import { onMounted, watch } from 'vue-demi';
import {
  insertLayerIntoMap,
} from '../../composables/utils';

const props = defineProps<{settings?: ConstructorParameters<typeof YMapDefaultSchemeLayer>[0]}>();

let mapLayer: YMapDefaultSchemeLayer | undefined;

watch(props, () => {
  mapLayer?.update(props.settings || {});
}, {
  deep: true,
});

onMounted(async () => {
  mapLayer = await insertLayerIntoMap(() => new ymaps3.YMapDefaultSchemeLayer(props.settings || {}));
});
</script>
