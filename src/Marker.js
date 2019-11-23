import * as utils from './utils';

const MARKER_TYPES = [
  'placemark',
  'polyline',
  'rectangle',
  'polygon',
  'circle',
];

export default {
  props: {
    coords: {
      type: Array,
      required: true,
      validator(val) {
        return !val.filter(item => Number.isNaN(item)).length;
      },
    },
    hintContent: String,
    icon: Object,
    balloon: Object,
    markerType: {
      type: String,
      validator(val) {
        return MARKER_TYPES.includes(val.toLowerCase());
      },
      default: 'placemark',
    },
    markerFill: Object,
    markerStroke: Object,
    clusterName: [String, Number],
    circleRadius: {
      validator(val) {
        return !Number.isNaN(val);
      },
      default: 1000,
    },
    callbacks: Object,
    balloonTemplate: String,
    markerId: {
      type: [String, Number],
      required: true,
    },
    properties: Object,
    options: Object,
  },
  data() {
    return {
      $_map: null,
      $_marker: null
    }
  },
  render() {
  },
  methods: {
    init() {
      // Create marker
      const markerType = utils.createMarkerType(this.markerType, this.$_map.useObjectManager)

      const initialProps = {
        hintContent: this.hintContent,
        iconContent: this.icon ? this.icon.content : null,
        markerId: this.markerId,
      };

      const balloonProps = this.balloon ? {
        balloonContentHeader: this.balloon.header,
        balloonContentBody: this.balloon.body,
        balloonContentFooter: this.balloon.footer,
      } : {};

      const properties = Object.assign(initialProps, balloonProps, this.properties);

      const iconOptions = (this.icon && this.icon.layout) ? {
        iconLayout: this.icon.layout,
        iconImageHref: this.icon.imageHref,
        iconImageSize: this.icon.imageSize,
        iconImageOffset: this.icon.imageOffset,
        iconContentOffset: this.icon.contentOffset,
      } : { preset: this.icon && `islands#${utils.getIconPreset({ icon: this.icon })}Icon` };

      if (this.icon && this.icon.layout && this.icon.contentLayout && typeof this.icon.contentLayout === 'string') {
        iconOptions.iconContentLayout = ymaps.templateLayoutFactory
          .createClass(this.icon.contentLayout);
      }

      const strokeOptions = this.markerStroke ? {
        strokeColor: this.markerStroke.color || '0066ffff',
        strokeOpacity: parseFloat(this.markerStroke.opacity) >= 0
          ? parseFloat(this.markerStroke.opacity) : 1,
        strokeStyle: this.markerStroke.style,
        strokeWidth: parseFloat(this.markerStroke.width) >= 0 ? parseFloat(this.markerStroke.width) : 1,
      } : {};

      const fillOptions = this.markerFill ? {
        fill: this.markerFill.enabled || true,
        fillColor: this.markerFill.color || '0066ff99',
        fillOpacity: parseFloat(this.markerFill.opacity) >= 0 ? parseFloat(this.markerFill.opacity) : 1,
        fillImageHref: this.markerFill.imageHref || '',
      } : {};

      const options = Object.assign(
        iconOptions,
        strokeOptions,
        fillOptions,
        this.options,
      );

      this.$_marker = new ymaps[markerType](this.coords, properties, options);

      this.$_marker.events.add('click', e => this.$emit('click', e));

      // Associate marker to map
      this.$_map.myMap.geoObjects.add(this.$_marker);

      /*const config = {
        options: this.$_map.clusterOptions,
        callbacks: this.$_map.clusterCallbacks,
        map: this.$_map.myMap,
        useObjectManager: this.$_map.useObjectManager,
        objectManagerClusterize: this.$_map.objectManagerClusterize,
      };
      utils.addToMap([this.$_marker], config);*/
    },
    removeFromMap() {
      if (this.$_marker) {
        this.$_map.myMap.geoObjects.remove(this.$_marker);
      }
    }
  },
  mounted() {
    // Find parent map component
    const $_findAncestor = (condition) => {
      let search = this.$parent;

      while (search) {
        if (condition(search)) {
          return search;
        }
        search = search.$parent;
      }

      return null;
    }

    this.$_map = $_findAncestor(a => a.$options.name === 'yandex-map');

    // Init marker when ymap is ready
    if (this.$_map.initialized) {
      this.init();
    } else {
      this.$_map.$on('map-was-initialized', () => {
        this.init();
      });
    }

    // Watch each prop to update marker
    Object.keys(this.$props).forEach((prop) => {
      this.$watch(
        prop,
        (newVal, oldVal) => {
          if (!utils.objectComparison(newVal, oldVal)) {
            this.removeFromMap();
            this.init();
          }
        },
      );
    });
  },
  beforeDestroy () {
    this.removeFromMap();
  },
};
