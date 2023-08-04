<script lang="ts">
import { YMapLayer } from '@yandex/ymaps3-types';
import {
  onMounted, watch, PropType, h,
  defineComponent,
} from 'vue';
import {
  insertLayerIntoMap,
} from '../../composables/utils';

export default defineComponent({
  name: 'YMapLayer',
  props: {
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapLayer>[0]>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    let mapLayer: YMapLayer | undefined;

    watch(() => props, () => {
      mapLayer?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapLayer = await insertLayerIntoMap(() => new ymaps3.YMapLayer(props.settings || {}));
    });

    return () => h('div', slots.default?.());
  },
});
</script>
