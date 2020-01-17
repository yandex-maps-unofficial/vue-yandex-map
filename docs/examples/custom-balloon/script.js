export default {
  data: () => ({
    coords: [54, 39],
  }),
  computed: {
    balloonTemplate() {
      return `
        <h1 class="red">Hi, everyone!</h1>
        <p>I am here: ${this.coords}</p>
        <img src="http://via.placeholder.com/350x150">
      `
    }
  },
  methods: {
    onClick(e) {
      this.coords = e.get('coords');
    }
  }  
}