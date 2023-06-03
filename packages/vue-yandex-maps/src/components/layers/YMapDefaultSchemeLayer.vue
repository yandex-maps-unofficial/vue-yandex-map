<script lang="ts">
import { YMapDefaultSchemeLayer } from '@yandex/ymaps3-types';
import {
  onMounted, watch, defineComponent, PropType, h,
} from 'vue-demi';
import {
  insertLayerIntoMap,
} from '../../composables/utils';

export default defineComponent({
  name: 'YMapDefaultSchemeLayer',
  props: {
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapDefaultSchemeLayer>[0]>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    let mapLayer: YMapDefaultSchemeLayer | undefined;

    watch(props, () => {
      mapLayer?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapLayer = await insertLayerIntoMap(() => new ymaps3.YMapDefaultSchemeLayer(props.settings || {}));
    });

    return () => h('div', slots.default?.());
  },
});
</script>
