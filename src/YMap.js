import * as utils from './utils'

export default {
  pluginOptions: {},
  data () {
    return {
      ymapEventBus: utils.emitter,
      ymapId: 'yandexMap' + Math.round(Math.random() * 100000),
      myMap: {},
      markers: [],
      style: this.ymapClass ? '' : 'width: 100%; height: 100%;'
    }
  },
  props: {
    coords: {
      type: Array,
      validator (val) {
        return !val.filter(item => isNaN(item)).length
      },
      required: true
    },
    zoom: {
      validator (val) {
        return !isNaN(val)
      },
      default: 18
    },
    clusterOptions: {
      type: Object,
      default: () => ({})
    },
    clusterCallbacks: {
      type: Object,
      default: () => ({})
    },
    behaviors: {
      type: Array,
      default: () => ['default']
    },
    controls: {
      type: Array,
      default: () => ['default'],
      validator (val) {
        return utils.controlsTypeValidator(val)
      }
    },
    detailedControls: {
      type: Object,
      validator (val) {
        const controls = Object.keys(val)
        return utils.controlsTypeValidator(controls)
      }
    },
    scrollZoom: {
      type: Boolean,
      default: true
    },
    zoomControl: Object,
    mapType: {
      type: String,
      default: 'map',
      validator (val) {
        return ['map', 'satellite', 'hybrid'].includes(val)
      }
    },
    placemarks: {
      type: Array,
      default () {
        return []
      }
    },
    useObjectManager: {
      type: Boolean,
      default: false
    },
    objectManagerClusterize: {
      type: Boolean,
      default: true
    },
    ymapClass: String,
    initWithoutMarkers: {
      type: Boolean,
      default: true
    },
    mapLink: String,
    debug: {
      type: Boolean,
      default: false
    },
    settings: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    coordinates () {
      return this.coords.map(item => +item)
    }
  },
  methods: {
    deleteMarkers (arrayIds) {
      let map = this.myMap

      if (arrayIds.length) {
        arrayIds.forEach(value => {
          let di = this.markers.indexOf(value)
          if (di !== -1) {
            this.markers.splice(di, 1)
          }
        })

        if (map.geoObjects) {
          map.geoObjects.each(function (collection) {
            if (collection) {
              if (collection.each) {
                let remove = []
                collection.each(function (item) {
                  if (item && item.properties) {
                    let id = item.properties.get('markerId')
                    if (id) {
                      if (arrayIds.indexOf(id) !== -1) {
                        remove.push(item)
                      }
                    }
                  }
                })
                if (collection.getLength() === 0 || collection.getLength() === remove.length) {
                  map.geoObjects.remove(collection)
                } else if (remove.length) {
                  for (let i in remove) {
                    collection.remove(remove[i])
                  }
                }
                // TODO - Start
              } else if (collection.properties) {
                // TODO этот код мною не тестировался. Нужен для удаления точек, которые не находятся в коллекциях
                // TODO @PNKBizz Удали его если считаешь, что он лишний
                let id = collection.properties.get('markerId')
                if (id) {
                  if (arrayIds.indexOf(id) !== -1) {
                    map.geoObjects.remove(collection)
                  }
                }
              }
              // TODO - End
            }
          })
        }
      }
    },
    updateMarkers () {
      let { createMarkers, deleteMarkers } = this.getMarkers()
      this.deleteMarkers(deleteMarkers)
      if (createMarkers.length) {
        this.setMarkers(createMarkers)
      }
    },
    getMarkersFromSlots () {
      return this.$slots.default && this.$slots.default.map(m => {
        const props = m.componentOptions && m.componentOptions.propsData
        if (!props) return
        let balloonOptions = {}

        if (props.balloonTemplate) {
          const BalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(props.balloonTemplate)
          balloonOptions = { balloonContentLayout: BalloonContentLayoutClass }
        }

        let marker = {
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
          balloonOptions
        }

        if (props.icon && ['default#image', 'default#imageWithContent'].includes(props.icon.layout)) {
          marker.iconContent = props.icon.content
          marker.iconLayout = props.icon.layout
          marker.iconImageHref = props.icon.imageHref
          marker.iconImageSize = props.icon.imageSize
          marker.iconImageOffset = props.icon.imageOffset
          marker.iconContentOffset = props.icon.contentOffset
          if (props.icon.contentLayout && typeof props.icon.contentLayout === 'string') {
            marker.iconContentLayout = ymaps.templateLayoutFactory.createClass(props.icon.contentLayout)
          }
        } else {
          marker.icon = props.icon
        }

        return marker
      }).filter(marker => marker && marker.markerType) || []
    },
    getMarkers () {
      let markers = []
      let deleteMarkers = [...this.markers]

      const myMarkers = this.getMarkersFromSlots()

      for (let i = 0; i < myMarkers.length; i++) {
        const m = myMarkers[i]

        let di = deleteMarkers.indexOf(m.markerId)
        if (di > -1) {
          deleteMarkers.splice(di, 1)
        }

        if (this.markers.indexOf(m.markerId) === -1) {
          this.markers.push(m.markerId)

          const markerType = utils.createMarkerType(m.markerType, this.useObjectManager)
          const initialProps = {
            hintContent: m.hintContent,
            iconContent: m.icon && m.icon.content || m.iconContent,
            markerId: m.markerId
          }

          const balloonProps = m.balloon ? {
            balloonContentHeader: m.balloon.header,
            balloonContentBody: m.balloon.body,
            balloonContentFooter: m.balloon.footer
          } : {}

          const properties = Object.assign(initialProps, balloonProps, m.properties)

          const iconOptions = m.iconLayout ? {
            iconLayout: m.iconLayout,
            iconImageHref: m.iconImageHref,
            iconImageSize: m.iconImageSize,
            iconImageOffset: m.iconImageOffset,
            iconContentOffset: m.iconContentOffset,
            iconContentLayout: m.iconContentLayout
          } : { preset: m.icon && `islands#${utils.getIconPreset(m)}Icon` }

          const strokeOptions = m.markerStroke ? {
            strokeColor: m.markerStroke.color || '0066ffff',
            strokeOpacity: parseFloat(m.markerStroke.opacity) >= 0 ? parseFloat(m.markerStroke.opacity) : 1,
            strokeStyle: m.markerStroke.style,
            strokeWidth: parseFloat(m.markerStroke.width) >= 0 ? parseFloat(m.markerStroke.width) : 1
          } : {}

          const fillOptions = m.markerFill ? {
            fill: m.markerFill.enabled || true,
            fillColor: m.markerFill.color || '0066ff99',
            fillOpacity: parseFloat(m.markerFill.opacity) >= 0 ? parseFloat(m.markerFill.opacity) : 1,
            fillImageHref: m.markerFill.imageHref || ''
          } : {}

          const options = Object.assign(iconOptions, strokeOptions, fillOptions, m.balloonOptions, m.options)

          if (markerType === 'Circle') {
            m.coords = [m.coords, m.circleRadius]
          }

          const obj = {
            properties,
            options,
            markerType,
            coords: m.coords,
            clusterName: m.clusterName,
            callbacks: m.callbacks
          }
          const marker = utils.createMarker(obj, this.useObjectManager)

          markers.push(marker)
        }
      }

      if (this.placemarks) {
        this.placemarks.forEach(placemark => {
          let di = deleteMarkers.indexOf(placemark.markerId)
          if (di !== -1) {
            deleteMarkers.splice(di, 1)
          }

          if (this.markers.indexOf(placemark.markerId) === -1) {
            this.markers.push(placemark.markerId)

            const { markerType = 'Placemark', properties, options = {}, coords, clusterName, callbacks, balloonTemplate } = placemark
            const type = utils.createMarkerType(markerType, this.useObjectManager)
            if (balloonTemplate) {
              const BalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(balloonTemplate)
              options.balloonContentLayout = BalloonContentLayoutClass
            }
            const obj = { properties, options, markerType: type, coords, clusterName, callbacks }
            let yplacemark = utils.createMarker(obj, this.useObjectManager)

            markers.push(yplacemark)
          }
        })
      }

      return {
        createMarkers: markers,
        deleteMarkers
      }
    },
    createMarkers () {
      let markers = []
      const myMarkers = this.getMarkersFromSlots()

      for (let i = 0; i < myMarkers.length; i++) {
        const m = myMarkers[i]
        const markerType = utils.createMarkerType(m.markerType, this.useObjectManager)
        const initialProps = {
          hintContent: m.hintContent,
          iconContent: m.icon && m.icon.content || m.iconContent,
          markerId: m.markerId
        }

        const balloonProps = m.balloon ? {
          balloonContentHeader: m.balloon.header,
          balloonContentBody: m.balloon.body,
          balloonContentFooter: m.balloon.footer
        } : {}

        const properties = Object.assign(initialProps, balloonProps, m.properties)

        const iconOptions = m.iconLayout ? {
          iconLayout: m.iconLayout,
          iconImageHref: m.iconImageHref,
          iconImageSize: m.iconImageSize,
          iconImageOffset: m.iconImageOffset,
          iconContentOffset: m.iconContentOffset,
          iconContentLayout: m.iconContentLayout
        } : { preset: m.icon && `islands#${utils.getIconPreset(m)}Icon` }

        const strokeOptions = m.markerStroke ? {
          strokeColor: m.markerStroke.color || '0066ffff',
          strokeOpacity: parseFloat(m.markerStroke.opacity) >= 0 ? parseFloat(m.markerStroke.opacity) : 1,
          strokeStyle: m.markerStroke.style,
          strokeWidth: parseFloat(m.markerStroke.width) >= 0 ? parseFloat(m.markerStroke.width) : 1
        } : {}

        const fillOptions = m.markerFill ? {
          fill: m.markerFill.enabled || true,
          fillColor: m.markerFill.color || '0066ff99',
          fillOpacity: parseFloat(m.markerFill.opacity) >= 0 ? parseFloat(m.markerFill.opacity) : 1,
          fillImageHref: m.markerFill.imageHref || ''
        } : {}

        const options = Object.assign(iconOptions, strokeOptions, fillOptions, m.balloonOptions, m.options)

        if (markerType === 'Circle') {
          m.coords = [m.coords, m.circleRadius]
        }

        const obj = {
          properties,
          options,
          markerType,
          coords: m.coords,
          clusterName: m.clusterName,
          callbacks: m.callbacks
        }
        const marker = utils.createMarker(obj, this.useObjectManager)

        markers.push(marker)
      }

      if (this.placemarks) {
        this.placemarks.forEach(placemark => {
          const { markerType = 'Placemark', properties, options = {}, coords, clusterName, callbacks, balloonTemplate } = placemark
          const type = utils.createMarkerType(markerType, this.useObjectManager)
          if (balloonTemplate) {
            const BalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(balloonTemplate)
            options.balloonContentLayout = BalloonContentLayoutClass
          }
          const obj = { properties, options, markerType: type, coords, clusterName, callbacks }
          let yplacemark = utils.createMarker(obj, this.useObjectManager)

          markers.push(yplacemark)
        })
      }

      return markers
    },
    setMarkers (markers) {
      const config = {
        options: this.clusterOptions,
        callbacks: this.clusterCallbacks,
        map: this.myMap,
        useObjectManager: this.useObjectManager,
        objectManagerClusterize: this.objectManagerClusterize
      }
      utils.addToCart(markers, config)
    },
    init () {
      // if ymap isn't initialized or have no markers;
      if (!window.ymaps || !ymaps.GeoObjectCollection || (!this.initWithoutMarkers && !this.$slots.default && !this.placemarks.length)) return

      this.$emit('map-initialization-started')

      this.myMap = new ymaps.Map(this.ymapId, {
        center: this.coordinates,
        zoom: +this.zoom,
        behaviors: this.behaviors,
        controls: this.controls,
        type: `yandex#${this.mapType}`
      }, this.options)
      this.myMap.events.add('click', e => this.$emit('click', e))
      if (this.zoomControl) {
        this.myMap.controls.remove('zoomControl')
        this.myMap.controls.add(new ymaps.control.ZoomControl(this.zoomControl))
      }
      if (this.detailedControls) {
        const controls = Object.keys(this.detailedControls)
        controls.forEach(controlName => {
          this.myMap.controls.remove(controlName)
          this.myMap.controls.add(controlName, this.detailedControls[controlName])
        })
      }
      if (this.scrollZoom === false) {
        this.myMap.behaviors.disable('scrollZoom')
      }

      this.updateMarkers()

      this.$emit('map-was-initialized', this.myMap)
    }
  },
  watch: {
    coordinates (newVal) {
      this.myMap.panTo && this.myMap.panTo(newVal)
    },
    placemarks () {
      if (window.ymaps) {
        this.updateMarkers()
      }
    },
    zoom () {
      this.myMap.setZoom(this.zoom)
    }
  },
  render (h) {
    return h(
      'section',
      {
        class: 'ymap-container',
        ref: 'mapContainer'
      },
      [
        h(
          'div',
          {
            attrs: {
              id: this.ymapId,
              class: this.ymapClass,
              style: this.style
            }
          }
        ),
        h(
          'div',
          {
            ref: 'markersContainer',
            attrs: {
              class: 'ymap-markers'
            }
          },
          [
            this.$slots.default
          ]
        )
      ]
    )
  },
  mounted () {
    this.markerObserver = new MutationObserver(function () {
      this.updateMarkers()
    }.bind(this))

    this.mapObserver = new MutationObserver(function () {
      this.myMap.container.fitToViewport()
    }.bind(this))

    // Setup the observer
    const { markersContainer, mapContainer } = this.$refs
    this.markerObserver.observe(
      markersContainer,
      { attributes: true, childList: true, characterData: true, subtree: true }
    )

    this.mapObserver.observe(
      mapContainer,
      { attributes: true, childList: true, characterData: true, subtree: false }
    )

    if (this.ymapEventBus.scriptIsNotAttached) {
      const yandexMapScript = document.createElement('SCRIPT')
      const {
        apiKey = '',
        lang = 'ru_RU',
        version = '2.1',
        coordorder = 'latlong'
      } = { ...this.$options.pluginOptions, ...this.settings }
      const mode = this.debug ? 'debug' : 'release'
      const settings = `lang=${lang}${apiKey && `&apikey=${apiKey}`}&mode=${mode}&coordorder=${coordorder}`
      const mapLink = this.mapLink || `https://api-maps.yandex.ru/${version}/?${settings}`
      yandexMapScript.setAttribute('src', mapLink)
      yandexMapScript.setAttribute('async', '')
      yandexMapScript.setAttribute('defer', '')
      document.body.appendChild(yandexMapScript)
      this.ymapEventBus.scriptIsNotAttached = false
      yandexMapScript.onload = () => {
        this.ymapEventBus.ymapReady = true
        this.ymapEventBus.$emit('scriptIsLoaded')
      }
    }
    if (this.ymapEventBus.ymapReady) {
      ymaps.ready(this.init)
    } else {
      this.ymapEventBus.$on('scriptIsLoaded', () => {
        this.ymapEventBus.updateMap = () => {
          this.updateMarkers()
        }
        ymaps.ready(this.init)
      })
    }
  },
  beforeDestroy () {
    this.markers = []
    this.myMap.geoObjects && this.myMap.geoObjects.removeAll()
    this.markerObserver.disconnect()
  }
}
