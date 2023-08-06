<script lang="ts">
import { YMapMarker } from '@yandex/ymaps3-types';
import {
  defineComponent, onMounted, PropType, watch, h, ref,
} from 'vue';
import { insertChildrenIntoMap } from '../composables/utils';

export default defineComponent({
  name: 'YandexMapMarker',
  props: {
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapMarker>[0]>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    let mapChildren: YMapMarker | undefined;

    watch(() => props, () => {
      mapChildren?.update(props.settings || {});
    }, {
      deep: true,
    });

    const element = ref<null | HTMLDivElement>(null);

    onMounted(async () => {
      mapChildren = await insertChildrenIntoMap(() => new ymaps3.YMapMarker(
        props.settings,
        element.value!,
      ));
    });

    return () => h('div', {
      ref: element,
    }, slots.default?.());
  },
});
</script>
