<script lang="ts">
import { YMapControls } from '@yandex/ymaps3-types';
import {
  defineComponent, h, onMounted, PropType, provide, Ref, ref, shallowRef, watch, nextTick,
} from 'vue';
import { waitTillMapInit, injectMap } from '../../composables/utils';

export default defineComponent({
  name: 'YMapControls',
  props: {
    settings: {
      type: Object as PropType<ConstructorParameters<typeof YMapControls>[0]>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    const mapChildren: Ref<YMapControls | null> = shallowRef(null);
    const controlInitPromises = ref<PromiseLike<any>[]>([]);
    provide('control', mapChildren);
    provide('controlInitPromises', controlInitPromises);

    watch(props, () => {
      mapChildren.value?.update(props.settings || {});
    }, {
      deep: true,
    });

    onMounted(async () => {
      const map = injectMap();
      await waitTillMapInit();
      mapChildren.value = new ymaps3.YMapControls(props.settings);

      await nextTick();
      await Promise.all(controlInitPromises.value);
      map?.value?.addChild(mapChildren.value);
    });

    return () => (mapChildren.value ? h('div', slots.default?.()) : h('div'));
  },
});
</script>
