<script lang="ts">
import { YMapDefaultFeaturesLayer } from '@yandex/ymaps3-types';
import {
  onMounted, watch, PropType, h,
  defineComponent,
} from 'vue';
import {
  insertLayerIntoMap,
} from '../../composables/utils';

export default defineComponent({
  name: 'YMapDefaultFeaturesLayer',
  props: {
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapDefaultFeaturesLayer>[0]>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    let mapLayer: YMapDefaultFeaturesLayer | undefined;

    watch(props, () => {
      mapLayer?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapLayer = await insertLayerIntoMap(() => new ymaps3.YMapDefaultFeaturesLayer(props.settings || {}));
    });

    return () => h('div', slots.default?.());
  },
});
</script>
