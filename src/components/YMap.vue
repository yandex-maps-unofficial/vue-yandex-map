<template>
  <component :is="tag" class="__ymap" :style="{ width, height }">
    <div ref="ymapContainer" class="__ymap_container" />
    <div v-show="false" class="__ymap_slots">
      <slot />
    </div>
  </component>
</template>

<script lang="ts">
import {
  PropType, defineComponent, onMounted, ref, watch, provide,
} from 'vue-demi';
import { YMap, YMapProps } from '@yandex/ymaps3-types';
import { GenericEntity } from '@yandex/ymaps3-types/imperative/Entities';
import { initYmaps } from '../composables/maps';
import { VueYandexMaps } from '../types/settings';

export default defineComponent({
  name: 'YMap',
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
     * Modifying this object will call map.update with new settings.
     *
     * Instead, you can also use map methods, such as setLocation/setBehaviors e.t.c.
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
     * Modifying this object will cause whole component to rerender.
     *
     * Instead, please use map methods, such as addChild.
     * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/map.html#layers
     * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/map.html#layers
     */
    layers: {
      type: Array as PropType<GenericEntity<unknown>[]>,
      default: (() => []),
    },
  },
  /**
   * @description Other events are NOT available. You can listen to events via layers prop, addChildren prop or by adding <ymap-listener> as children.
   * @see https://yandex.ru/dev/maps/jsapi/doc/3.0/dg/concepts/events.html
   * @see https://yandex.com/dev/maps/jsapi/doc/3.0/dg/concepts/events.html
   */
  emits: {
    'update:map'(map: YMap | unknown) {
      return map && map instanceof ymaps3.YMap;
    },
  },
  setup(props) {
    const map = ref<YMap | null>(null);
    const ymapContainer = ref<HTMLDivElement | null>(null);

    provide('map', map);

    const init = async () => {
      if (!ymapContainer.value) throw new Error('<yandex-map> container is undefined after component mount. This is likely Vue Yandex Map internal bug.');

      if (map.value) map.value.destroy();
      map.value = new ymaps3.YMap(ymapContainer.value, props.settings, props.layers);
    };

    onMounted(async () => {
      if (!VueYandexMaps.loaded.value) {
        if (VueYandexMaps.settings.value.initializeOn === 'onComponentMount') {
          try {
            await initYmaps();
          } catch (e) {
            console.error('An error occured while initializing Yandex Map with onComponentMount setting');
            console.error(e);
          }
        } else throw new Error('You have set up <yandex-map> component without initializing Yandex maps. Please check initializeOn setting or call initYmaps manually before registering this component.');
      }

      await init();
    });

    watch(() => props.settings, (val: YMapProps) => {
      map.value?.update(val);
    }, {
      deep: true,
    });

    watch(() => props.layers, (val) => {
      init();
    });

    return {
      ymapContainer,
    };
  },
});
</script>
