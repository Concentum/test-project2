<template id="workarea">
  <div>
    <div id="nav" v-if="md">
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
</template>

<script>

export default {
  name: 'workarea',
  data () {
    return {
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
    },
    md () {
      return this.$store.getters.metadata
    }
  },
  methods: {
    openWin (e) {
      this.$store.dispatch('openWin', e)
    }
  },
  created () {
    this.$store.dispatch('getMetadata')
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
