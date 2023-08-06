<script lang="ts">
import {
  onMounted, watch, h, PropType,
  defineComponent,
} from 'vue';
import {
  BehaviorEvents, DomEvents, MapEvents, YMapListener,
} from '@yandex/ymaps3-types';
import { insertChildrenIntoMap } from '../composables/utils';

export default defineComponent({
  name: 'YandexMapListener',
  props: {
    settings: {
      type: Object as PropType<Partial<DomEvents & MapEvents & BehaviorEvents>>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    let mapListener: YMapListener | undefined;

    watch(() => props, () => {
      mapListener?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      mapListener = await insertChildrenIntoMap(() => new ymaps3.YMapListener(props.settings || {}));
    });

    return () => h('div', slots.default?.());
  },
});
</script>
