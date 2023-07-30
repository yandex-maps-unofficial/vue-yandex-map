<script lang="ts">
import {
  onMounted, watch, PropType, h,
  defineComponent,
} from 'vue';
import { YMapGeolocationControl } from '@yandex/ymaps3-types/packages/controls';
import {
  insertControlIntoMap,
} from '../../composables/utils';

export default defineComponent({
  name: 'YMapGeolocationControl',
  props: {
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapGeolocationControl>[0]>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    let mapLayer: YMapGeolocationControl | undefined;

    watch(props, () => {
      mapLayer?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapLayer = await insertControlIntoMap(() => ymaps3.import('@yandex/ymaps3-controls@0.0.1'), async (controls) => new controls.YMapGeolocationControl(props.settings));
    });

    return () => h('div', slots.default?.());
  },
});
</script>
