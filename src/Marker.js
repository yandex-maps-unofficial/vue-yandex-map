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

      this.$_marker = new ymaps.Placemark(this.coords, properties, this.options);

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
  },
  beforeDestroy () {
    if (this.$_marker) {
      this.$_map.myMap.geoObjects.remove(this.$_marker);
    }
  },
};
