<template>
  <div id="app">
    <div v-if="user">
      <div id="nav">
        <main-menu :items="md.interfaces.main.menu" is-root @open-win="openWin"/>
      </div>

      <tray :items="items"
       :current="current"
        @open-win="openWin"
      />
  <!-- <router-view> -->
      <keep-alive>
        <component v-if="current"
        :is="'win'"
        :item="current"
        :key="current.key"
      />
      </keep-alive>
  <!-- </router-view> -->
    </div>
    <div v-else>
      <login/>
    </div>  
  </div>
</template>

<script>
import metadata from './metadata.json'

export default {
  name: 'app',
  data () {
    return {
      md: metadata
    }
  },
  computed: {
    items () {
      return this.$store.getters.wins
    },
    current () {
      return this.$store.getters.currentWin
    },
    user () {
      return this.$store.getters.user
    }
  },
  methods: {
    openWin (e) {
      this.$store.dispatch('openWin', e)
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
