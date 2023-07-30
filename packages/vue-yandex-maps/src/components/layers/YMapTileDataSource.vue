<script lang="ts">
import { YMapTileDataSource } from '@yandex/ymaps3-types';
import {
  defineComponent, h, onMounted, PropType, watch,
} from 'vue';
import { insertLayerIntoMap } from '../../composables/utils.ts';

export default defineComponent({
  name: 'YMapTileDataSource',
  props: {
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapTileDataSource>[0]>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    let mapChildren: YMapTileDataSource | undefined;

    watch(props, () => {
      mapChildren?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapChildren = await insertLayerIntoMap(() => new ymaps3.YMapTileDataSource(props.settings));
    });

    return () => h('div', slots.default?.());
  },
});
</script>
