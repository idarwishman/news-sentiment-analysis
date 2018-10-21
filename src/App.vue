<template>
  <div id="app">
    <img src="https://cdn.dribbble.com/users/1111912/screenshots/5427558/reactions.gif" width="400" class="homeImage">
    
    <!-- <img src="http://i.imgur.com/EudhFzO.gif" width="250"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
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
}
</style>
