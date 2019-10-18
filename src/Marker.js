import { compareValues, emitter } from './utils';

const MARKER_TYPES = [
  'placemark',
  'polyline',
  'rectangle',
  'polygon',
  'circle',
];

const unwatchArr = [];

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
    clusterName: String,
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
  render() {
  },
  mounted() {
    Object.keys(this.$props).forEach((prop) => {
      unwatchArr.push(this.$watch(
        prop,
        (newVal, oldVal) => compareValues(newVal, oldVal, this.markerId),
      ));
    });
  },
  beforeDestroy() {
    unwatchArr.forEach(f => f());
    emitter.deleteMarker(this.markerId);
  },
};
