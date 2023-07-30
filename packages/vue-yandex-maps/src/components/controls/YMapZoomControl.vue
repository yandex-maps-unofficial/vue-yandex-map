<script lang="ts">
import {
  onMounted, watch, PropType, h,
  defineComponent,
} from 'vue';
import { YMapZoomControl } from '@yandex/ymaps3-types/packages/controls';
import {
  insertControlIntoMap,
} from '../../composables/utils';

export default defineComponent({
  name: 'YMapZoomControl',
  props: {
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapZoomControl>[0]>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    let mapLayer: YMapZoomControl | undefined;

    watch(props, () => {
      mapLayer?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapLayer = await insertControlIntoMap(() => ymaps3.import('@yandex/ymaps3-controls@0.0.1'), async (controls) => new controls.YMapZoomControl(props.settings));
    });

    return () => h('div', slots.default?.());
  },
});
</script>
