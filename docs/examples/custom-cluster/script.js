export default {
  data: () => ({
    coords: [54, 39],
    zoom: 10,
    clusterOptions: {
      1: {
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonLayout: [
          '<ul class=list>',
          '{% for geoObject in properties.geoObjects %}',
          '<li><a href=# class="list_item">{{ geoObject.properties.balloonContentHeader|raw }}</a></li>',
          '{% endfor %}',
          '</ul>',
        ].join(''),
      },
    },
  }),
};
