export default class YMapLoad {
    constructor() {
        this._yandexMapScript = null;
        this._scriptIsNotAttached = true;
        this._ymapReady = false;
        this._ymaps = null;
        this._debug = false;
        this._pluginOptions = {};
    }

    yMapLoad(settings = {}) {
        let mapLink;
        if(typeof settings === "string") {
            mapLink = settings
        } else {
            const {
                apiKey = '',
                lang = 'ru_RU',
                version = '2.1',
                coordorder = 'latlong'
            } = {...this._pluginOptions, ...settings};
            const mode = this._debug ? 'debug' : 'release';
            const params = `lang=${lang}${apiKey && `&apikey=${apiKey}`}&mode=${mode}&coordorder=${coordorder}`
            mapLink = `https://api-maps.yandex.ru/${version}/?${params}`;
        }

        return new Promise((resolve, reject) => {
            if (this._scriptIsNotAttached) {
                this._yandexMapScript = document.createElement('SCRIPT');
                this._yandexMapScript.setAttribute('src', mapLink);
                this._yandexMapScript.setAttribute('async', '');
                this._yandexMapScript.setAttribute('defer', '');
                document.body.appendChild(this._yandexMapScript);
                this._scriptIsNotAttached = false;

                this._eventLoadYandexMapScript()
            }

            if (this._ymapReady) {
                this._ymaps.ready(() => resolve(this._ymaps));
            } else {
                this._eventLoadYandexMapScript(() => {
                    this._ymaps.ready(() => resolve(this._ymaps));
                });
            }
        });
    }

    _eventLoadYandexMapScript(callback) {
        this._yandexMapScript.onload = () => {
            this._ymapReady = true;
            this._ymaps = window.ymaps;
            typeof callback === "function" && callback();
        }
    }
}
