import * as utils from './utils';

const { emitter } = utils;

export default {
  pluginOptions: {},
  provide() {
    let deleteMarkerWithTimeout;
    let rerender;
    const deletedMarkers = [];
    let changedMarkers = [];
    const deleteMarker = (id) => {
      if (!this.myMap.geoObjects) return;
      deletedMarkers.push(id);
      if (deleteMarkerWithTimeout) clearTimeout(deleteMarkerWithTimeout);
      deleteMarkerWithTimeout = setTimeout(() => this.deleteMarkers(deletedMarkers), 10);
    };
    const compareValues = ({ newVal, oldVal, id }) => {
      if (utils.objectComparison(newVal, oldVal)) { return; }
      changedMarkers.push(id);
      if (rerender) { clearTimeout(rerender); }
      rerender = setTimeout(() => {
        this.setMarkers(changedMarkers);
        changedMarkers = [];
      }, 10);
    };
    return {
      deleteMarker,
      rerender: null,
      compareValues,
    };
  },
  data() {
    return {
      ymapId: `yandexMap${Math.round(Math.random() * 100000)}`,
      myMap: {},
      style: this.ymapClass ? '' : 'width: 100%; height: 100%;',
    };
  },
  props: {
    coords: {
      type: Array,
      validator(val) {
        return !val.filter(item => Number.isNaN(item)).length;
      },
      required: true,
    },
    zoom: {
      validator(val) {
        return !Number.isNaN(val);
      },
      default: 18,
    },
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
    zoomControl: Object,
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
  },
  computed: {
    coordinates() {
      return this.coords.map(item => +item);
    },
  },
  methods: {
    getMarkersFromSlots(changedMarkers) {
      return this.$slots.default ? this.$slots.default.map((m) => {
        const props = m.componentOptions && m.componentOptions.propsData;
        if (!props || (changedMarkers && !changedMarkers.includes(props.markerId))) return;
        let balloonOptions = {};

        if (props.balloonTemplate) {
          const BalloonContentLayoutClass = ymaps.templateLayoutFactory
            .createClass(props.balloonTemplate);
          balloonOptions = { balloonContentLayout: BalloonContentLayoutClass };
        }

        const marker = {
          markerId: props.markerId,
          markerType: props.markerType || 'placemark',
          coords: utils.setCoordsToNumeric(props.coords),
          hintContent: props.hintContent,
          markerFill: props.markerFill,
          circleRadius: +props.circleRadius,
          clusterName: props.clusterName,
          markerStroke: props.markerStroke,
          balloon: props.balloon,
          callbacks: props.callbacks,
          properties: props.properties,
          options: props.options,
          balloonOptions,
        };

        if (props.icon && ['default#image', 'default#imageWithContent'].includes(props.icon.layout)) {
          marker.iconContent = props.icon.content;
          marker.iconLayout = props.icon.layout;
          marker.iconImageHref = props.icon.imageHref;
          marker.iconImageSize = props.icon.imageSize;
          marker.iconImageOffset = props.icon.imageOffset;
          marker.iconContentOffset = props.icon.contentOffset;
          if (props.icon.contentLayout && typeof props.icon.contentLayout === 'string') {
            marker.iconContentLayout = ymaps.templateLayoutFactory
              .createClass(props.icon.contentLayout);
          }
        } else {
          marker.icon = props.icon;
        }

        return marker;
      }).filter(marker => marker && marker.markerType) : [];
    },
    createMarkers(changedMarkers) {
      const markers = [];
      const myMarkers = this.getMarkersFromSlots(changedMarkers);
      if (changedMarkers) this.deleteMarkers(changedMarkers);

      for (let i = 0; i < myMarkers.length; i++) {
        const m = myMarkers[i];
        const markerType = utils.createMarkerType(m.markerType, this.useObjectManager);
        const initialProps = {
          hintContent: m.hintContent,
          iconContent: m.icon ? m.icon.content : m.iconContent,
          markerId: m.markerId,
        };

        const balloonProps = m.balloon ? {
          balloonContentHeader: m.balloon.header,
          balloonContentBody: m.balloon.body,
          balloonContentFooter: m.balloon.footer,
        } : {};

        const properties = Object.assign(initialProps, balloonProps, m.properties);

        const iconOptions = m.iconLayout ? {
          iconLayout: m.iconLayout,
          iconImageHref: m.iconImageHref,
          iconImageSize: m.iconImageSize,
          iconImageOffset: m.iconImageOffset,
          iconContentOffset: m.iconContentOffset,
          iconContentLayout: m.iconContentLayout,
        } : { preset: m.icon && `islands#${utils.getIconPreset(m)}Icon` };

        const strokeOptions = m.markerStroke ? {
          strokeColor: m.markerStroke.color || '0066ffff',
          strokeOpacity: parseFloat(m.markerStroke.opacity) >= 0
            ? parseFloat(m.markerStroke.opacity) : 1,
          strokeStyle: m.markerStroke.style,
          strokeWidth: parseFloat(m.markerStroke.width) >= 0 ? parseFloat(m.markerStroke.width) : 1,
        } : {};

        const fillOptions = m.markerFill ? {
          fill: m.markerFill.enabled || true,
          fillColor: m.markerFill.color || '0066ff99',
          fillOpacity: parseFloat(m.markerFill.opacity) >= 0 ? parseFloat(m.markerFill.opacity) : 1,
          fillImageHref: m.markerFill.imageHref || '',
        } : {};

        const options = Object.assign(
          iconOptions,
          strokeOptions,
          fillOptions,
          m.balloonOptions,
          m.options,
        );

        if (markerType === 'Circle') {
          m.coords = [m.coords, m.circleRadius];
        }

        const obj = {
          properties,
          options,
          markerType,
          coords: m.coords,
          clusterName: m.clusterName,
          callbacks: m.callbacks,
        };
        const marker = utils.createMarker(obj, this.useObjectManager);

        markers.push(marker);
      }

      if (this.placemarks) {
        this.placemarks.forEach((placemark) => {
          const {
            markerType = 'Placemark', properties, options = {}, coords, clusterName, callbacks, balloonTemplate,
          } = placemark;
          const type = utils.createMarkerType(markerType, this.useObjectManager);
          if (balloonTemplate) {
            const BalloonContentLayoutClass = ymaps.templateLayoutFactory
              .createClass(balloonTemplate);
            options.balloonContentLayout = BalloonContentLayoutClass;
          }
          const obj = {
            properties, options, markerType: type, coords, clusterName, callbacks,
          };
          const yplacemark = utils.createMarker(obj, this.useObjectManager);

          markers.push(yplacemark);
        });
      }

      return markers;
    },
    setMarkers(changedMarkers) {
      const config = {
        options: this.clusterOptions,
        callbacks: this.clusterCallbacks,
        map: this.myMap,
        useObjectManager: this.useObjectManager,
        objectManagerClusterize: this.objectManagerClusterize,
      };
      utils.addToMap(this.createMarkers(changedMarkers), config);
      if (changedMarkers) this.$emit('markers-was-change', changedMarkers);
    },
    deleteMarkers(deletedMarkers) {
      this.myMap.geoObjects.each((collection) => {
        const removedMarkers = [];
        if (this.useObjectManager) {
          collection.remove(deletedMarkers);
        } else {
          const checkMarker = (marker) => {
            const markerId = marker.properties.get('markerId');
            if (deletedMarkers.includes(markerId)) removedMarkers.push(marker);
          };
          let length;
          if (collection.each) {
            collection.each(checkMarker);
            length = collection.getLength();
          } else {
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
      this.$emit('markers-was-delete', deletedMarkers);
    },
    init() {
      // if ymap isn't initialized or have no markers;
      if (!window.ymaps
        || !ymaps.GeoObjectCollection
        || (!this.initWithoutMarkers && !this.$slots.default && !this.placemarks.length)
      ) return;

      this.$emit('map-initialization-started');

      this.myMap = new ymaps.Map(this.ymapId, {
        center: this.coordinates,
        zoom: +this.zoom,
        behaviors: this.behaviors,
        controls: this.controls,
        type: `yandex#${this.mapType}`,
      }, this.options);
      this.myMap.events.add('click', e => this.$emit('click', e));
      if (this.zoomControl) {
        this.myMap.controls.remove('zoomControl');
        this.myMap.controls.add(new ymaps.control.ZoomControl(this.zoomControl));
      }
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

      this.setMarkers();

      if (this.showAllMarkers) this.myMap.setBounds(this.myMap.geoObjects.getBounds());

      this.$emit('map-was-initialized', this.myMap);
    },
  },
  watch: {
    coordinates(newVal) {
      if (this.myMap.panTo) this.myMap.panTo(newVal);
    },
    placemarks() {
      if (window.ymaps) {
        if (this.myMap.geoObjects) this.myMap.geoObjects.removeAll();
        this.setMarkers();
      }
    },
    zoom() {
      this.myMap.setZoom(this.zoom);
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
        h(
          'div',
          {
            ref: 'markersContainer',
            attrs: {
              class: 'ymap-markers',
            },
          },
          [
            this.$slots.default,
          ],
        ),
      ],
    );
  },
  mounted() {
    if (this.$attrs['map-link'] || this.$attrs.mapLink) throw new Error('Vue-yandex-maps: Attribute mapLink is not supported. Use settings.');

    this.mapObserver = new MutationObserver((() => {
      this.myMap.container.fitToViewport();
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
      emitter.$on('scriptIsLoaded', () => {
        ymaps.ready(this.init);
      });
    }
  },
  beforeDestroy() {
    if (this.myMap.geoObjects) this.myMap.geoObjects.removeAll();
  },
};
