export default class CalculateService {
  constructor() {
    this.yandexMapScript = null;
    this.scriptIsNotAttached = true;
    this.ymapReady = false;
    this.ymaps = null;
  }

  yMapLoad({mapLink, debug = false, settings = {}}, pluginOptions = {}) {
    return new Promise((resolve, reject) => {
      if (this.scriptIsNotAttached) {
        this.yandexMapScript = document.createElement('SCRIPT');
        const {
          apiKey = '',
          lang = 'ru_RU',
          version = '2.1',
          coordorder = 'latlong'
        } = { ...pluginOptions, ...settings };
        const mode = debug ? 'debug' : 'release';
        const settings = `lang=${lang}${ apiKey && `&apikey=${apiKey}` }&mode=${mode}&coordorder=${coordorder}`
        const mapLink = mapLink || `https://api-maps.yandex.ru/${version}/?${settings}`;
        this.yandexMapScript.setAttribute('src', mapLink);
        this.yandexMapScript.setAttribute('async', '');
        this.yandexMapScript.setAttribute('defer', '');
        document.body.appendChild(this.yandexMapScript);
        this.scriptIsNotAttached = false;

        this._eventLoadYandexMapScript()
      }

      if (this.ymapReady) {
        this.ymaps.ready(() => resolve(this.ymaps));
      } else {
        this._eventLoadYandexMapScript (() => {
          this.ymaps.ready(() => resolve(this.ymaps));
        });
      }
    });
  }

  _eventLoadYandexMapScript (callback) {
    this.yandexMapScript.onload = () => {
      console.log(window.ymaps)
      this.ymapReady = true;
      this.ymaps = window.ymaps;
      typeof callback === "function" && callback();
    }
  }
}
