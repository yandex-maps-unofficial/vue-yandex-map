<script lang="ts">
import {
  onMounted, watch, h, PropType,
} from 'vue';
import { defineComponent } from 'vue';
import {
  BehaviorEvents, DomEvents, MapEvents, YMapListener,
} from '@yandex/ymaps3-types';
import { injectMap, waitTillMapInit } from '../composables/utils';

export default defineComponent({
  name: 'YMapListener',
  props: {
    settings: {
      type: Object as PropType<Partial<DomEvents & MapEvents & BehaviorEvents>>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    const map = injectMap();

    let mapListener: YMapListener | undefined;

    watch(props, () => {
      mapListener?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      await waitTillMapInit();

      mapListener = new ymaps3.YMapListener(props.settings || {});
      map.value?.addChild(mapListener);
    });

    return () => h('div', slots.default?.());
  },
});
</script>
