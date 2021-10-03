import { h } from 'vue';
import * as utils from './utils';

const { emitter } = utils;

const mapEvents = [
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

let markers = [];
let myMap = {};

export default {
  pluginOptions: {},
  provide() {
    let deletedMarkers = [];
    let changedMarkers = [];
    let deleteMarkerWithTimeout;
    let changeMarkersWithTimeout;
    const deleteMarker = (id) => {
      if (!myMap.geoObjects) return;
      deletedMarkers.push(id);
      if (deleteMarkerWithTimeout) clearTimeout(deleteMarkerWithTimeout);
      deleteMarkerWithTimeout = setTimeout(() => {
        this.deleteMarkers(deletedMarkers);
        deletedMarkers = [];
      }, 0);
    };
    const compareValues = ({ newVal, oldVal, marker }) => {
      if (utils.objectComparison(newVal, oldVal)) {
        return;
      }
      changedMarkers.push(marker);
      if (changeMarkersWithTimeout) {
        clearTimeout(changeMarkersWithTimeout);
      }
      changeMarkersWithTimeout = setTimeout(() => {
        this.setMarkers(changedMarkers);
        changedMarkers = [];
      }, 0);
    };
    return {
      useObjectManager: this.useObjectManager,
      addMarker: this.addMarker,
      deleteMarker,
      compareValues,
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
  emits: [
    'map-initialization-started',
    'boundschange',
    'update:zoom',
    'update:coords',
    'update:bounds',
    'map-was-initialized',
    'markers-was-change',
    'markers-was-delete',
    ...mapEvents,
  ],
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
    showAllMarkers: Boolean,
    disablePan: Boolean,
  },
  computed: {
    coordinates() {
      return this.coords.map(item => +item);
    },
  },
  methods: {
    init() {
      // if ymap isn't initialized or have no markers;
      if (
        !window.ymaps
        || !ymaps.GeoObjectCollection
        || (!this.initWithoutMarkers && !this.$slots.default && !this.placemarks.length)
      ) return;

      this.$emit('map-initialization-started');

      myMap = new ymaps.Map(
        this.ymapId,
        {
          center: this.coordinates,
          zoom: +this.zoom,
          bounds: this.bounds,
          behaviors: this.behaviors,
          controls: this.controls,
          type: `yandex#${this.mapType}`,
        },
        this.options,
      );

      mapEvents.forEach(_ => myMap.events.add(_, e => this.$emit(_, e)));
      myMap.events.add('boundschange', (e) => {
        const {
          originalEvent: { newZoom, newCenter, newBounds },
        } = e;
        this.$emit('boundschange', e);
        this.$emit('update:zoom', newZoom);
        this.$emit('update:coords', newCenter);
        this.$emit('update:bounds', newBounds);
      });
      if (this.detailedControls) {
        const controls = Object.keys(this.detailedControls);
        controls.forEach((controlName) => {
          myMap.controls.remove(controlName);
          myMap.controls.add(controlName, this.detailedControls[controlName]);
        });
      }
      if (this.scrollZoom === false) {
        myMap.behaviors.disable('scrollZoom');
      }

      this.isReady = true;

      this.$emit('map-was-initialized', myMap);
    },
    addMarker(marker) {
      markers.push(marker);
      if (this.debounce) clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.setMarkers(markers);
      }, 0);
    },
    setMarkers(marks) {
      const config = {
        options: this.clusterOptions,
        callbacks: this.clusterCallbacks,
        map: myMap,
        useObjectManager: this.useObjectManager,
        objectManagerClusterize: this.objectManagerClusterize,
      };
      if (markers !== marks) {
        const ids = marks.map(_ => (this.useObjectManager ? _.id : _.properties.get('markerId')));
        this.deleteMarkers(ids);
        utils.addToMap(marks, config);
        this.$emit('markers-was-change', ids);
      } else utils.addToMap(marks, config);
      markers = [];
      if (this.showAllMarkers) myMap.setBounds(myMap.geoObjects.getBounds());
    },
    deleteMarkers(deletedMarkersIds) {
      myMap.geoObjects.each((collection) => {
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
            myMap.geoObjects.remove(collection);
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
        if (myMap.setCenter) myMap.setCenter(val);
      } else if (myMap.panTo && myMap.getZoom()) myMap.panTo(val, { checkZoomRange: true });
    },
    zoom() {
      myMap.setZoom(this.zoom);
    },
    bounds(val) {
      if (myMap.setBounds) myMap.setBounds(val);
    },
  },
  render() {
    return h(
      'section',
      {
        class: 'ymap-container',
        ref: 'mapContainer',
      },
      [
        h('div', {
          id: this.ymapId,
          class: this.ymapClass,
          style: this.style,
        }),
        this.isReady
          && h(
            'div',
            {
              ref: 'markersContainer',
              class: 'ymap-markers',
            },
            this.$slots.default && this.$slots.default(),
          ),
      ],
    );
  },
  mounted() {
    if (this.$attrs['map-link'] || this.$attrs.mapLink) throw new Error('Vue-yandex-maps: Attribute mapLink is not supported. Use settings.');

    if (this.placemarks && this.placemarks.length) {
      throw new Error(
        'Vue-yandex-maps: Attribute placemarks is not supported. Use marker component.',
      );
    }

    this.mapObserver = new MutationObserver(() => {
      if (myMap.container) myMap.container.fitToViewport();
    });

    // Setup the observer
    const { mapContainer } = this.$refs;
    this.mapObserver.observe(mapContainer, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: false,
    });

    if (emitter.scriptIsNotAttached) {
      const { debug } = this;
      const settings = {
        ...this.$options.pluginOptions,
        ...this.settings,
        debug,
      };
      utils.ymapLoader(settings);
    }
    if (emitter.ymapReady) {
      ymaps.ready(this.init);
    } else {
      emitter.$on('scriptIsLoaded', () => {
        ymaps.ready(this.init);
      });
    }
  },
  beforeUnmount() {
    if (myMap.geoObjects) myMap.geoObjects.removeAll();
  },
};
