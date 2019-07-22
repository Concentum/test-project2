<template>
  <div class="search-panel">
    <input v-model="search">
    <div class="button-clear" v-show="search" @click="clear"><span>×</span></div>
  </div>
</template>

<script>

export default {
  name: 'search-panel',
  data () {
    return {
      search: ''
    }
  },
  methods: {
    clear () {
      this.search = ''
    }
  },
  watch: {
    search: _.debounce(function (newVal) {
      this.$emit('search', newVal)
    }, 500)
  }
}
</script>

<style scoped lang="scss">
.search-panel {
margin: 5px;
  display: inline-block;
}
input {
  border-radius: 2px;
  border: 1px solid lightGray;
  height: 17px;
  color: gray;
  padding: 1px 25px 1px 3px;
  display: inline-block;
}
.button-clear {
  display: inline-block;
  margin-left: -18px;
  cursor: default;
}
</style>
