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
      if (!this.myMap.geoObjects) return;
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
      this.myMap = {};
      this.markers = [];

      // if ymap isn't initialized or have no markers;
      if (!window.ymaps
        || !ymaps.GeoObjectCollection
        || (!this.initWithoutMarkers && !this.$slots.default && !this.placemarks.length)
      ) return;

      this.$emit('map-initialization-started');

      this.myMap = new ymaps.Map(this.ymapId, {
        center: this.coordinates,
        zoom: +this.zoom,
        bounds: this.bounds,
        behaviors: this.behaviors,
        controls: this.controls,
        type: `yandex#${this.mapType}`,
      }, this.options);
      const events = this.mapEvents.length ? this.mapEvents : defaultMapEvents;
      events.forEach(_ => this.myMap.events.add(_, e => this.$emit(_, e)));
      this.myMap.events.add('boundschange', (e) => {
        const { originalEvent: { newZoom, newCenter, newBounds } } = e;
        this.$emit('boundschange', e);
        this.$emit('update:zoom', newZoom);
        this.$emit('update:coords', newCenter);
        this.$emit('update:bounds', newBounds);
      });
      if (this.detailedControls) {
        const controls = Object.keys(this.detailedControls);
        controls.forEach((controlName) => {
          this.myMap.controls.remove(controlName);
          this.myMap.controls.add(controlName, this.detailedControls[controlName]);
        });
      }
      if (this.scrollZoom === false) {
        this.myMap.behaviors.disable('scrollZoom');
      }

      this.isReady = true;

      this.$emit('map-was-initialized', this.myMap);
    },
    addMarker(marker) {
      this.markers.push(marker);
      if (this.debounce) clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.setMarkers(this.markers);
      }, 0);
    },
    setMarkers(markers) {
      const config = {
        options: this.clusterOptions,
        callbacks: this.clusterCallbacks,
        map: this.myMap,
        useObjectManager: this.useObjectManager,
        objectManagerClusterize: this.objectManagerClusterize,
        useHtmlInLayout: this.useHtmlInLayout,
      };
      if (this.markers !== markers) {
        const ids = markers.map(_ => (this.useObjectManager ? _.id : _.properties.get('markerId')));
        this.deleteMarkers(ids);
        utils.addToMap(markers, config);
        this.$emit('markers-was-change', ids);
      } else utils.addToMap(markers, config);
      this.markers = [];
      if (this.showAllMarkers) {
        this.myMap.setBounds(this.myMap.geoObjects.getBounds());
      }
    },
    deleteMarkers(deletedMarkersIds) {
      // geoObjects.each is not immutable, so:
      const geoObjects = [];
      this.myMap.geoObjects.each(geoObject => geoObjects.push(geoObject));

      // and now - iterate & possibly delete
      geoObjects.forEach((collection) => {
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
            this.myMap.geoObjects.remove(collection);
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
      if (!this.myMap) return;
      if (this.disablePan) {
        if (this.myMap.setCenter) this.myMap.setCenter(val);
      } else if (this.myMap.panTo && this.myMap.getZoom()) {
        this.myMap.panTo(val, { checkZoomRange: true });
      }
    },
    zoom() {
      if (this.myMap) this.myMap.setZoom(this.zoom);
    },
    bounds(val) {
      if (this.myMap && this.myMap.setBounds) this.myMap.setBounds(val);
    },
  },
  render(h) {
    return h(
      'section',
      {
        class: 'ymap-container',
        ref: 'mapContainer',
      },
      [
        h(
          'div',
          {
            attrs: {
              id: this.ymapId,
              class: this.ymapClass,
              style: this.style,
            },
          },
        ),
        this.isReady && h(
          'div',
          [
            this.$slots.default,
          ],
        ),
      ],
    );
  },
  mounted() {
    if (this.$attrs['map-link'] || this.$attrs.mapLink) throw new Error('Vue-yandex-maps: Attribute mapLink is not supported. Use settings.');

    if (this.placemarks && this.placemarks.length) throw new Error('Vue-yandex-maps: Attribute placemarks is not supported. Use marker component.');

    this.mapObserver = new MutationObserver((() => {
      if (this.myMap.container) {
        this.myMap.container.fitToViewport();
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
    if (this.myMap && this.myMap.geoObjects) this.myMap.geoObjects.removeAll();
  },
};
