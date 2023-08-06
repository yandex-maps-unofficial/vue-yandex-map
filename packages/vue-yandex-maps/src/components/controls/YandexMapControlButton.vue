<script lang="ts">
import {
  onMounted, watch, PropType, h,
  defineComponent,
} from 'vue';
import { YMapControlButton } from '@yandex/ymaps3-types';
import {
  insertControlIntoMap,
} from '../../composables/utils';

export default defineComponent({
  name: 'YandexMapControlButton',
  props: {
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapControlButton>[0]>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    let mapLayer: YMapControlButton | undefined;

    watch(() => props, () => {
      mapLayer?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapLayer = await insertControlIntoMap(async () => new ymaps3.YMapControlButton(props.settings));
    });

    return () => h('div', slots.default?.());
  },
});
</script>
