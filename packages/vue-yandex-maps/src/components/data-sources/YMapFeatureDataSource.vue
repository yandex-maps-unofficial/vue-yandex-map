<script lang="ts">
import { YMapFeatureDataSource } from '@yandex/ymaps3-types';
import {
  defineComponent, h, onMounted, PropType, watch,
} from 'vue';
import { insertLayerIntoMap } from '../../composables/utils';

export default defineComponent({
  name: 'YMapFeatureDataSource',
  props: {
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapFeatureDataSource>[0]>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    let mapChildren: YMapFeatureDataSource | undefined;

    watch(props, () => {
      mapChildren?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapChildren = await insertLayerIntoMap(() => new ymaps3.YMapFeatureDataSource(props.settings));
    });

    return () => h('div', slots.default?.());
  },
});
</script>
