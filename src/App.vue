<template>
  <div id="app">
    <img src="https://s3.amazonaws.com/hoodflix/news-sentiment-analysis/QWTLQYi.gif" width="600" class="homeImage" @click="goHome">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    goHome() {
      window.location.href = "/";
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.homeImage {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  margin-bottom: 15px;
}
</style>
