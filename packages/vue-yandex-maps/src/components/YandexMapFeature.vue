<script lang="ts">
import { YMapFeature } from '@yandex/ymaps3-types';
import {
  defineComponent, h, onMounted, PropType, watch,
} from 'vue';
import { insertChildrenIntoMap } from '../composables/utils';

export default defineComponent({
  name: 'YandexMapFeature',
  props: {
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapFeature>[0]>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    let mapChildren: YMapFeature | undefined;

    watch(() => props, () => {
      mapChildren?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapChildren = await insertChildrenIntoMap(() => new ymaps3.YMapFeature(props.settings));
    });

    return () => h('div', slots.default?.());
  },
});
</script>
