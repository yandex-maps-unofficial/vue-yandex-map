<script lang="ts">
import {
  defineComponent, h, nextTick, onBeforeUnmount, onMounted, PropType, provide, Ref, ref, shallowRef,
} from 'vue';
import type { YMap, YMapEntity, YMapProps } from '@yandex/ymaps3-types';
import { initYmaps } from '../composables/maps';
import { VueYandexMaps } from '../types/settings';

export default defineComponent({
  name: 'YandexMap',
  props: {
    map: {
      type: Object as PropType<YMap | null>,
      default: null,
    },
    tag: {
      type: String,
      default: 'div',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
    /**
     * @description Settings for cart initialization.
     *
     * Modifying this object after mount will cause no effect.
     *
     * Instead, you myst use map methods, such as setLocation/setBehaviors e.t.c.
     * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/map.html#map-parms
     * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/map.html#map-parms
     */
    settings: {
      type: Object as PropType<YMapProps>,
      validator: (val: any) => {
        if (!('location' in val)) return false;
        return true;
      },
      required: true,
    },
    /**
     * @description You can also add layers through <yandex-*> components
     *
     * Modifying this object after mount will cause no effect.
     *
     * Instead, please use map methods, such as addChild.
     * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/map.html#layers
     * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/map.html#layers
     */
    layers: {
      type: Array as PropType<YMapEntity<unknown>[]>,
      default: (() => []),
    },
  },
  /**
   * @description Other events are NOT available. You can listen to events via layers prop, addChildren prop or by adding <ymap-listener> as children.
   * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/events.html
   * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/events.html
   */
  emits: {
    'update:map'(map: YMap | null): boolean {
      return !map || typeof ymaps3 === 'undefined' || map instanceof ymaps3.YMap;
    },
  },
  setup(props, {
    slots,
    emit,
  }) {
    const map = shallowRef<YMap | null>(null);
    const layers = shallowRef([]);
    const ymapContainer = ref<HTMLDivElement | null>(null);
    const mounted = shallowRef(false);

    provide('map', map);
    provide('layers', layers);
    emit('update:map', map.value);

    const init = async () => {
      const container = ymapContainer.value;
      if (!container) throw new Error('<yandex-map> container is undefined after component mount. This is likely Vue Yandex Map internal bug.');

      if (map.value) map.value.destroy();

      const createdMap = new ymaps3.YMap(container, props.settings, [
        ...layers.value,
        ...props.layers,
      ]);

      map.value = createdMap;
      emit('update:map', map.value);
    };

    onMounted(async () => {
      if (!VueYandexMaps.loaded.value) {
        if (VueYandexMaps.settings.value.initializeOn === 'onComponentMount') {
          try {
            await initYmaps();
          } catch (e) {
            console.error('An error occured while initializing Yandex Map with onComponentMount setting');
            console.error(e);
            return;
          }
        } else {
          throw new Error('You have set up <yandex-map> component without initializing Yandex maps. Please check initializeOn setting or call initYmaps manually before registering this component.');
        }
      }

      mounted.value = true;
      await nextTick();
      setTimeout(init, 300);
    });

    onBeforeUnmount(() => {
      map.value = null;
      emit('update:map', map.value);
    });

    return () => {
      const container = h('div', {
        class: '__ymap_container',
        style: {
          width: '100%',
          height: '100%',
        },
        ref: ymapContainer,
      });

      if (!mounted.value) return container;

      const result = h(props.tag, {
        class: '__ymap',
        style: {
          width: props.width,
          height: props.height,
        },
      }, [
        container,
        h('div', {
          class: '__ymap_slots',
          style: { display: 'none' },
        }, slots.default?.()),
      ]);

      return result;
    };
  },
});
</script>
