Vue.component('my-component', {
  template: '<button id="btn">Click</button>',
});

export default {
  data: () => ({
    coords: [
      54.82896654088406,
      39.831893822753904,
    ],
  }),
  methods: {
    bindListener() {
      document.getElementById('btn').addEventListener('click', this.handler);
    },
    unbindListener() {
      document.getElementById('btn').removeEventListener('click', this.handler);
    },
    handler() {
      alert('Whoo-Ha!');
    },
  },
};
