export default {
  data: () => ({
    coords: [54, 39],
    zoom: 10,
    clusterOptions: {
      '1': {
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterLayout: [
          '<ul class=list>',
          '{% for geoObject in properties.geoObjects %}',
          '<li><a href=# data-placemarkid="{{ geoObject.properties.placemarkId }}" class="list_item">{{ geoObject.properties.balloonContentHeader|raw }}</a></li>',
          '{% endfor %}',
          '</ul>'
        ].join('')
      }
    }
  })
}
