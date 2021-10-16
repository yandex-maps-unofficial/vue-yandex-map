// eslint-disable-next-line import/no-extraneous-dependencies
import { h } from 'vue';
import * as utils from './utils';

const { emitter } = utils;

const defaultMapEvents = [
  'actionend',
  'balloonclose',
  'balloonopen',
  'click',
  'contextmenu',
  'dblclick',
  'destroy',
  'hintclose',
  'hintopen',
  'optionschange',
  'sizechange',
  'typechange',
];

export default {
  pluginOptions: {},
  provide() {
    let deletedMarkers = [];
    let changedMarkers = [];
    let deleteMarkerWithTimeout;
    let changeMarkersWithTimeout;
    const deleteMarker = (id) => {
      if (!this.$options.static.myMap.geoObjects) return;
      deletedMarkers.push(id);
      if (deleteMarkerWithTimeout) clearTimeout(deleteMarkerWithTimeout);
      deleteMarkerWithTimeout = setTimeout(() => {
        this.deleteMarkers(deletedMarkers);
        deletedMarkers = [];
      }, 0);
    };
    const compareValues = ({ newVal, oldVal, marker }) => {
      if (utils.objectComparison(newVal, oldVal)) { return; }
      changedMarkers.push(marker);
      if (changeMarkersWithTimeout) { clearTimeout(changeMarkersWithTimeout); }
      changeMarkersWithTimeout = setTimeout(() => {
        this.setMarkers(changedMarkers);
        changedMarkers = [];
      }, 0);
    };

    let makeComponentBalloonTemplate;

    if (this.balloonComponent != null) {
      makeComponentBalloonTemplate = utils.makeComponentBalloonTemplate(this.balloonComponent);
    }

    return {
      useObjectManager: this.useObjectManager,
      addMarker: this.addMarker,
      deleteMarker,
      compareValues,
      makeComponentBalloonTemplate,
    };
  },
  data() {
    return {
      ymapId: `yandexMap${Math.round(Math.random() * 100000)}`,
      style: this.ymapClass ? '' : 'width: 100%; height: 100%;',
      isReady: false,
      debounce: null,
    };
  },
  static: {
    myMap: {},
    markers: [],
  },
  props: {
    coords: {
      type: Array,
      required: true,
    },
    zoom: {
      validator(val) {
        return !Number.isNaN(val);
      },
      default: 18,
    },
    bounds: Array,
    clusterOptions: {
      type: Object,
      default: () => ({}),
    },
    clusterCallbacks: {
      type: Object,
      default: () => ({}),
    },
    behaviors: {
      type: Array,
      default: () => ['default'],
    },
    controls: {
      type: Array,
      default: () => ['default'],
      validator(val) {
        return utils.controlsTypeValidator(val);
      },
    },
    detailedControls: {
      type: Object,
      validator(val) {
        const controls = Object.keys(val);
        return utils.controlsTypeValidator(controls);
      },
    },
    scrollZoom: {
      type: Boolean,
      default: true,
    },
    mapType: {
      type: String,
      default: 'map',
      validator(val) {
        return ['map', 'satellite', 'hybrid'].includes(val);
      },
    },
    placemarks: {
      type: Array,
      default() {
        return [];
      },
    },
    useObjectManager: {
      type: Boolean,
      default: false,
    },
    objectManagerClusterize: {
      type: Boolean,
      default: true,
    },
    ymapClass: String,
    initWithoutMarkers: {
      type: Boolean,
      default: true,
    },
    debug: {
      type: Boolean,
      default: false,
    },
    settings: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    mapEvents: {
      type: Array,
      default: () => [],
    },
    showAllMarkers: Boolean,
    disablePan: Boolean,
    balloonComponent: {
      type: [Object, Function],
      default: () => null,
    },
    useHtmlInLayout: Boolean,
  },
  computed: {
    coordinates() {
      return this.coords.map(item => +item);
    },
  },
  methods: {
    init() {
      // if ymap isn't initialized or have no markers;
      if (!window.ymaps
        || !ymaps.GeoObjectCollection
        || (!this.initWithoutMarkers && !this.$slots.default && !this.placemarks.length)
      ) return;

      this.$emit('map-initialization-started');

      this.$options.static.myMap = new ymaps.Map(this.ymapId, {
        center: this.coordinates,
        zoom: +this.zoom,
        bounds: this.bounds,
        behaviors: this.behaviors,
        controls: this.controls,
        type: `yandex#${this.mapType}`,
      }, this.options);
      const events = this.mapEvents.length ? this.mapEvents : defaultMapEvents;
      events.forEach(_ => this.$options.static.myMap.events.add(_, e => this.$emit(_, e)));
      this.$options.static.myMap.events.add('boundschange', (e) => {
        const { originalEvent: { newZoom, newCenter, newBounds } } = e;
        this.$emit('boundschange', e);
        this.$emit('update:zoom', newZoom);
        this.$emit('update:coords', newCenter);
        this.$emit('update:bounds', newBounds);
      });
      if (this.detailedControls) {
        const controls = Object.keys(this.detailedControls);
        controls.forEach((controlName) => {
          this.$options.static.myMap.controls.remove(controlName);
          this.$options.static.myMap.controls.add(controlName, this.detailedControls[controlName]);
        });
      }
      if (this.scrollZoom === false) {
        this.$options.static.myMap.behaviors.disable('scrollZoom');
      }

      this.isReady = true;

      this.$emit('map-was-initialized', this.$options.static.myMap);
    },
    addMarker(marker) {
      this.$options.static.markers.push(marker);
      if (this.debounce) clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.setMarkers(this.$options.static.markers);
      }, 0);
    },
    setMarkers(markers) {
      const config = {
        options: this.clusterOptions,
        callbacks: this.clusterCallbacks,
        map: this.$options.static.myMap,
        useObjectManager: this.useObjectManager,
        objectManagerClusterize: this.objectManagerClusterize,
        useHtmlInLayout: this.useHtmlInLayout,
      };
      if (this.$options.static.markers !== markers) {
        const ids = markers.map(_ => (this.useObjectManager ? _.id : _.properties.get('markerId')));
        this.deleteMarkers(ids);
        utils.addToMap(markers, config);
        this.$emit('markers-was-change', ids);
      } else utils.addToMap(markers, config);
      this.$options.static.markers = [];
      if (this.showAllMarkers) {
        this.$options.static.myMap.setBounds(this.$options.static.myMap.geoObjects.getBounds());
      }
    },
    deleteMarkers(deletedMarkersIds) {
      this.$options.static.myMap.geoObjects.each((collection) => {
        const removedMarkers = [];
        if (this.useObjectManager) {
          collection.remove(deletedMarkersIds);
        } else {
          const checkMarker = (marker) => {
            const markerId = marker.properties.get('markerId');
            if (deletedMarkersIds.includes(markerId)) removedMarkers.push(marker);
          };
          let length;
          if (collection.each) {
            collection.each(checkMarker);
            length = collection.getLength();
          } else if (collection.getGeoObjects) {
            const markersArray = collection.getGeoObjects();
            markersArray.forEach(checkMarker);
            length = markersArray.length;
          }
          if (length === 0 || length === removedMarkers.length) {
            this.$options.static.myMap.geoObjects.remove(collection);
          } else if (removedMarkers.length) {
            removedMarkers.forEach(marker => collection.remove(marker));
          }
        }
      });
      this.$emit('markers-was-delete', deletedMarkersIds);
    },
  },
  watch: {
    coordinates(val) {
      if (this.disablePan) {
        if (this.$options.static.myMap.setCenter) this.$options.static.myMap.setCenter(val);
      } else if (this.$options.static.myMap.panTo && this.$options.static.myMap.getZoom()) {
        this.$options.static.myMap.panTo(val, { checkZoomRange: true });
      }
    },
    zoom() {
      this.$options.static.myMap.setZoom(this.zoom);
    },
    bounds(val) {
      if (this.$options.static.myMap.setBounds) this.$options.static.myMap.setBounds(val);
    },
  },
  render(createElement) {
    const render = typeof createElement === 'function' ? createElement : h;
    const childProps = typeof createElement === 'function' ? {
      attrs: {
        id: this.ymapId,
        class: this.ymapClass,
        style: this.style,
      },
    } : {
      id: this.ymapId,
      class: this.ymapClass,
      style: this.style,
    };
    return render(
      'section',
      {
        class: 'ymap-container',
        ref: 'mapContainer',
      },
      [
        render(
          'div',
          childProps,
        ),
        this.isReady && render(
          'div',
          [
            typeof this.$slots.default === 'function' ? this.$slots.default() : this.$slots.default,
          ],
        ),
      ],
    );
  },
  mounted() {
    if (this.$attrs['map-link'] || this.$attrs.mapLink) throw new Error('Vue-yandex-maps: Attribute mapLink is not supported. Use settings.');

    if (this.placemarks && this.placemarks.length) throw new Error('Vue-yandex-maps: Attribute placemarks is not supported. Use marker component.');

    this.mapObserver = new MutationObserver((() => {
      if (this.$options.static.myMap.container) {
        this.$options.static.myMap.container.fitToViewport();
      }
    }));

    // Setup the observer
    const { mapContainer } = this.$refs;

    this.mapObserver.observe(
      mapContainer,
      {
        attributes: true, childList: true, characterData: true, subtree: false,
      },
    );

    if (emitter.scriptIsNotAttached) {
      const { debug } = this;
      const settings = { ...this.$options.pluginOptions, ...this.settings, debug };
      utils.ymapLoader(settings);
    }
    if (emitter.ymapReady) {
      ymaps.ready(this.init);
    } else {
      emitter.$on('scriptIsLoaded', this.init);
    }
  },
  beforeDestroy() {
    if (this.$options.static.myMap.geoObjects) this.$options.static.myMap.geoObjects.removeAll();
  },
  beforeUnmount() {
    if (this.$options.static.myMap.geoObjects) this.$options.static.myMap.geoObjects.removeAll();
  },
};
