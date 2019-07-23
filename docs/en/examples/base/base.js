export default {
  data: () => ({
    coords: [54, 39]
  }),
  methods: {
    onClick(e) {
      this.coords = e.get('coords');
    }
  }
}