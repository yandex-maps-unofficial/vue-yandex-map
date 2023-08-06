<script lang="ts">
import {
  onMounted, watch, PropType, h,
  defineComponent,
} from 'vue';
import { YMapControl } from '@yandex/ymaps3-types';
import {
  insertControlIntoMap,
} from '../../composables/utils';

export default defineComponent({
  name: 'YandexMapControl',
  props: {
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapControl>[0]>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    let mapLayer: YMapControl | undefined;

    watch(() => props, () => {
      mapLayer?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapLayer = await insertControlIntoMap(async () => new ymaps3.YMapControl(props.settings));
    });

    return () => h('div', slots.default?.());
  },
});
</script>
