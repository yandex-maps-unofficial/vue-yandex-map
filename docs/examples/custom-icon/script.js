export default {
  data: () => ({
    coords: [54, 39],
    markerIcon: {
      layout: 'default#imageWithContent',
      imageHref: 'https://image.flaticon.com/icons/png/512/33/33447.png',
      imageSize: [43, 43],
      imageOffset: [0, 0],
      content: '123 v12',
      contentOffset: [0, 15],
      contentLayout: '<div style="background: red; width: 50px; color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
    }
  })
}