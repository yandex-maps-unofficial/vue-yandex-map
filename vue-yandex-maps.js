(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.vueYandexMaps = factory());
}(this, (function () { 'use strict';

var YMapPlugin$1 = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":_vm.ymapId}})},staticRenderFns: [],
    data: function data() {
        return {
            ymapId: 'yandexMap' + Math.round(Math.random()*100000)
        }
    },
    props: {
        latitude: {
            type: Number,
            required: true
        },
        longtitude: {
            type: Number,
            required: true
        },
        hintContent: String,
        balloonContent: String
    },
    computed: {
        coords: function coords() {
            return [this.latitude, this.longtitude]
        }
    },
    beforeCreate: function beforeCreate() {
        var this$1 = this;

        if (this.$ymapEventBus.scriptIsNotAttached) {
            var yandexMapScript = document.createElement('SCRIPT');
            yandexMapScript.setAttribute('src', 'https://api-maps.yandex.ru/2.1/?lang=ru_RU');
            yandexMapScript.setAttribute('async', '');
            yandexMapScript.setAttribute('defer', '');
            document.body.appendChild(yandexMapScript);
            this.$ymapEventBus.scriptIsNotAttached = false;
            yandexMapScript.onload = function () {
                this$1.$ymapEventBus.ymapReady = true;
                this$1.$ymapEventBus.$emit('scriptIsLoaded');
            };
        } else {
            return false;
        }
    },
    created: function created() {
        var this$1 = this;

        window.addEventListener('DOMContentLoaded', function () {
            var myMap,
                myPlacemark;

            if (this$1.$ymapEventBus.ymapReady) {
                ymaps.ready(init.bind(this$1));
            } else {
                this$1.$ymapEventBus.$on('scriptIsLoaded', function () {
                    ymaps.ready(init.bind(this$1));
                });
            }

            function init() {
                console.log(this.ymapId);
                myMap = new ymaps.Map(this.ymapId, {
                    center: this.coords,
                    zoom: 18
                });

                myPlacemark = new ymaps.Placemark(this.coords, {
                    hintContent: this.hintContent,
                    balloonContent: this.balloonContent
                });

                myMap.geoObjects.add(myPlacemark);
            }
        });
    }
};

var install = function(Vue) {
  Vue.component('yandex-map', YMapPlugin$1);
  Vue.prototype.$ymapEventBus = new Vue({
      data: {
          ymapReady: false,
          scriptIsNotAttached: true
      }
  });
};

if (window.Vue) {
  window.YMapPlugin = YMapPlugin$1;
  Vue.use(install); // eslint-disable-line
}

YMapPlugin$1.install = install;

return YMapPlugin$1;

})));
