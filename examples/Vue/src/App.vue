<template>
  <div id="app">
    <yandex-map :coords="coords" @click="onClick">
      <ymap-marker 
        marker-id="123" 
        :coords="coords"
        :balloon-template="balloonTemplate"
      ></ymap-marker>
    </yandex-map>
  </div>
</template>

<script>
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
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.ymap-container {
  height: 600px;
}

.red {
  color: red;
}
</style>
