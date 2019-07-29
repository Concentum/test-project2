<template>
  <div id="app">
    <div v-if="user">
      <workarea/>
    </div>
    <div v-else>
      <login/>
    </div>  
  </div>
</template>

<script>
export default {
  name: 'app',
  computed: {
    user () {
      return this.$store.getters.user
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
