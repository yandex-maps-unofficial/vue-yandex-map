import {
  Ref, UnwrapRef, ref, ComputedGetter, DebuggerOptions, ComputedRef, computed, inject, getCurrentInstance, isRef, watch,
} from 'vue-demi';
import { YMap } from '@yandex/ymaps3-types';

/**
 * @description Prevents memory leak on SSR when ref is called outside setup
 */
export function safeRef<T = any>(value: T): Ref<UnwrapRef<T>> {
  if (typeof window === 'undefined') {
    return {
      // @ts-ignore
      value,
      // @ts-ignore
      __v_isRef: true,
    };
  }

  return ref<T>(value);
}

/**
 * @description Prevents memory leak on SSR when computed is called outside setup
 */
export function safeComputed<T>(
  getter: ComputedGetter<T>,
  debugOptions?: DebuggerOptions,
): ComputedRef<T> {
  if (typeof window === 'undefined') {
    return {
      get value() {
        return getter();
      },
      // @ts-ignore
      __v_isRef: true,
    };
  }

  return computed<T>(getter, debugOptions);
}

export function injectMap(): Ref<YMap | null> {
  if (!getCurrentInstance()) throw new Error('provideMap must be only called on runtime. This is likely Vue Yandex Map internal bug.');
  const map = inject<Ref<YMap | null>>('map');

  if (!map || !isRef(map)) throw new Error('Was not able to inject valid map in provideMap. This is likely Vue Yandex Map internal bug.');

  return map;
}

export function waitTillMapInit() {
  if (!getCurrentInstance()) throw new Error('onMapInit must be only called on runtime. This is likely Vue Yandex Map internal bug.');
  const map = injectMap();

  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (!map.value) reject(new Error('Was not able to wait for map initialization in mapInit. Ensure that map was initialized.'));
    }, 5000);

    const watcher = watch(map, () => {
      if (map.value) {
        watcher();
        clearTimeout(timeout);
        resolve();
      }
    }, {
      immediate: true,
    });
  });
}
