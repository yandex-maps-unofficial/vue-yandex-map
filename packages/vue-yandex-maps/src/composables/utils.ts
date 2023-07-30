import {
  computed,
  ComputedGetter,
  ComputedRef,
  DebuggerOptions,
  getCurrentInstance,
  inject,
  isRef,
  onBeforeUnmount,
  Ref,
  ref,
  UnwrapRef,
  watch,
  WatchStopHandle,
} from 'vue';
import { YMap, YMapControls, YMapEntity } from '@yandex/ymaps3-types';

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

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function injectMap(): Ref<YMap | null> {
  if (!getCurrentInstance()) throw new Error('injectMap must be only called on runtime. This is likely Vue Yandex Map internal bug.');
  const map = inject<Ref<YMap | null>>('map');

  if (!map || !isRef(map)) throw new Error('Was not able to inject valid map in injectMap. This is likely Vue Yandex Map internal bug.');

  return map;
}

export function injectLayers(): Ref<any[]> {
  if (!getCurrentInstance()) throw new Error('injectLayers must be only called on runtime. This is likely Vue Yandex Map internal bug.');
  const layers = inject<Ref<any[]>>('layers');

  if (!layers || !isRef(layers)) throw new Error('Was not able to inject valid layers in injectLayers. This is likely Vue Yandex Map internal bug.');

  return layers;
}

export function injectControl(): Ref<YMapControls | null> {
  if (!getCurrentInstance()) throw new Error('injectControl must be only called on runtime. This is likely Vue Yandex Map internal bug.');
  const control = inject<Ref<YMapControls | null>>('control');

  if (!control || !isRef(control)) throw new Error('Was not able to inject valid control in injectControl. This is likely Vue Yandex Map internal bug.');

  return control;
}

export function waitTillYmapInit() {
  return new Promise<void>((resolve, reject) => {
    let retries = 0;

    const interval = setInterval(() => {
      if (typeof ymaps3 !== 'undefined') {
        clearInterval(interval);
        return resolve();
      }

      retries++;
      // 5s
      if (retries === 20) {
        clearInterval(interval);
        reject(new Error('Was not able to wait for Yandex Maps initialization in waitTillYmapInit. Ensure that maps were initialized.'));
      }
    }, 250);
  });
}

export function waitTillMapInit(_map?: Ref<YMap | null>) {
  if (!_map && !getCurrentInstance()) throw new Error('onMapInit must be only called on runtime. This is likely Vue Yandex Map internal bug.');
  const map = _map || injectMap();

  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (!map.value) reject(new Error('Was not able to wait for map initialization in waitTillMapInit. Ensure that map was initialized.'));
    }, 5000);

    // Breaks without this
    let watcher: WatchStopHandle | undefined;

    // eslint-disable-next-line prefer-const
    watcher = watch(map, () => {
      if (map.value) {
        watcher?.();
        clearTimeout(timeout);
        resolve();
      }
    }, {
      immediate: true,
    });
  });
}

export async function insertLayerIntoMap<T extends YMapEntity<unknown>>(layerCreateFunction: () => T): Promise<T> {
  if (!getCurrentInstance()) throw new Error('insertLayerIntoMap must be only called on runtime. This is likely Vue Yandex Map internal bug.');

  const map = injectMap();
  const layers = injectLayers();
  let layer: T | undefined;

  onBeforeUnmount(() => {
    if (layer) {
      map.value?.removeChild(layer);
    }
  });

  await waitTillYmapInit();
  layer = layerCreateFunction();

  // If insertLayerIntoMap is called after map was initialized
  if (map.value) {
    map.value.addChild(layer);
  } else {
    layers.value.push(layer);
  }

  return layer;
}

export async function insertControlIntoMap<R extends(() => Promise<unknown>), T extends YMapEntity<unknown>>(requiredImport: R, controlCreateFunction: (neededImport: Awaited<ReturnType<R>>) => T | Promise<T>): Promise<T> {
  if (!getCurrentInstance()) throw new Error('insertControlIntoMap must be only called on runtime. This is likely Vue Yandex Map internal bug.');

  const control = injectControl();
  const controlInitPromises = inject<Ref<PromiseLike<any>[]>>('controlInitPromises');
  let newControl: T | undefined;

  onBeforeUnmount(() => {
    if (newControl) {
      control.value?.removeChild(newControl);
    }
  });

  await waitTillYmapInit();

  if (!control.value) throw new Error('control is undefined in insertControlIntoMap. Please ensure you are calling this component inside <y-map-controls> component.');
  controlInitPromises?.value.push(requiredImport());
  newControl = await controlCreateFunction(await requiredImport() as Awaited<ReturnType<R>>);

  control.value.addChild(newControl);
  return newControl;
}

export async function insertChildrenIntoMap<T extends YMapEntity<unknown>>(childrenCreateFunction: () => T): Promise<T> {
  if (!getCurrentInstance()) throw new Error('insertChildrenIntoMap must be only called on runtime. This is likely Vue Yandex Map internal bug.');

  const map = injectMap();
  let children: T | undefined;

  onBeforeUnmount(() => {
    if (children) {
      map.value?.removeChild(children);
    }
  });

  await waitTillMapInit();
  if (!map.value) throw new Error('map is undefined in insertChildrenIntoMap. This is likely Vue Yandex Map internal bug.');

  children = childrenCreateFunction();

  map.value.addChild(children);

  return children;
}
