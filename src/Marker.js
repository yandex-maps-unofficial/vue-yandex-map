import * as utils from './utils';

const MARKER_TYPES = [
  'placemark',
  'polyline',
  'rectangle',
  'polygon',
  'circle',
];

const markerEvents = [
  'balloonclose',
  'balloonopen',
  'click',
  'contextmenu',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'hintclose',
  'hintopen',
  'mouseenter',
  'mouseleave',
];

export default {
  inject: ['useObjectManager', 'addMarker', 'deleteMarker', 'compareValues'],
  props: {
    coords: Array,
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
    balloonTemplate: String,
    markerId: {
      type: [String, Number],
      required: true,
    },
    properties: Object,
    options: Object,
  },
  data: () => ({ unwatchArr: [] }),
  render(h) {
    return this.$slots.balloon && h('div', { style: 'display: none;' }, [this.$slots.balloon]);
  },
  mounted() {
    Object.keys(this.$props).forEach((prop) => {
      this.unwatchArr.push(this.$watch(
        prop,
        (newVal, oldVal) => this.compareValues({
          newVal,
          oldVal,
          marker: this.defineMarker(),
        }),
      ));
    });

    this.addMarker(this.defineMarker());
  },
  methods: {
    defineMarker() {
      let balloonOptions = {};

      if (this.balloonTemplate) {
        const BalloonContentLayoutClass = ymaps.templateLayoutFactory
          .createClass(this.balloonTemplate);
        balloonOptions = { balloonContentLayout: BalloonContentLayoutClass };
      }

      if (this.$slots.balloon) {
        const BalloonContentLayoutClass = ymaps.templateLayoutFactory
          .createClass(this.$slots.balloon[0].elm.outerHTML);
        balloonOptions = { balloonContentLayout: BalloonContentLayoutClass };
      }

      const marker = {
        markerId: this.markerId,
        markerType: this.markerType || 'placemark',
        coords: utils.setCoordsToNumeric(this.coords),
        hintContent: this.hintContent,
        markerFill: this.markerFill,
        circleRadius: +this.circleRadius,
        clusterName: this.clusterName,
        markerStroke: this.markerStroke,
        balloon: this.balloon,
        properties: this.properties,
        options: this.options,
        balloonOptions,
      };

      if (this.icon && ['default#image', 'default#imageWithContent'].includes(this.icon.layout)) {
        marker.iconContent = this.icon.content;
        marker.iconLayout = this.icon.layout;
        marker.iconImageHref = this.icon.imageHref;
        marker.iconImageSize = this.icon.imageSize;
        marker.iconImageOffset = this.icon.imageOffset;
        marker.iconContentOffset = this.icon.contentOffset;
        if (this.icon.contentLayout && typeof this.icon.contentLayout === 'string') {
          marker.iconContentLayout = ymaps.templateLayoutFactory
            .createClass(this.icon.contentLayout);
        }
      } else {
        marker.icon = this.icon;
      }

      const markerType = utils.createMarkerType(marker.markerType, this.useObjectManager);
      const initialProps = {
        hintContent: marker.hintContent,
        iconContent: marker.icon ? marker.icon.content : marker.iconContent,
        markerId: marker.markerId,
      };

      const balloonProps = marker.balloon ? {
        balloonContentHeader: marker.balloon.header,
        balloonContentBody: marker.balloon.body,
        balloonContentFooter: marker.balloon.footer,
      } : {};

      const properties = Object.assign(initialProps, balloonProps, marker.properties);

      const iconOptions = marker.iconLayout ? {
        iconLayout: marker.iconLayout,
        iconImageHref: marker.iconImageHref,
        iconImageSize: marker.iconImageSize,
        iconImageOffset: marker.iconImageOffset,
        iconContentOffset: marker.iconContentOffset,
        iconContentLayout: marker.iconContentLayout,
      } : { preset: marker.icon && `islands#${utils.getIconPreset(marker)}Icon` };

      const strokeOptions = marker.markerStroke ? {
        strokeColor: marker.markerStroke.color || '0066ffff',
        strokeOpacity: parseFloat(marker.markerStroke.opacity) >= 0
          ? parseFloat(marker.markerStroke.opacity) : 1,
        strokeStyle: marker.markerStroke.style,
        strokeWidth: parseFloat(marker.markerStroke.width) >= 0
          ? parseFloat(marker.markerStroke.width) : 1,
      } : {};

      const fillOptions = marker.markerFill ? {
        fill: marker.markerFill.enabled || true,
        fillColor: marker.markerFill.color || '0066ff99',
        fillOpacity: parseFloat(marker.markerFill.opacity) >= 0
          ? parseFloat(marker.markerFill.opacity) : 1,
        fillImageHref: marker.markerFill.imageHref || '',
      } : {};

      const options = Object.assign(
        iconOptions,
        strokeOptions,
        fillOptions,
        marker.balloonOptions,
        marker.options,
      );

      if (markerType === 'Circle') {
        marker.coords = [marker.coords, marker.circleRadius];
      }

      const obj = {
        properties,
        options,
        markerType,
        coords: marker.coords,
        clusterName: marker.clusterName,
      };

      const mapMarker = utils.createMarker(obj, this.useObjectManager, this.$emit);
      if (!this.useObjectManager) {
        markerEvents.forEach(_ => mapMarker.events.add(_, e => this.$emit(_, e)));
      }
      return mapMarker;
    },
  },
  beforeDestroy() {
    this.unwatchArr.forEach(f => f());
    this.deleteMarker(this.markerId);
  },
};
