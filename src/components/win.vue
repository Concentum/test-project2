<template>
  <div class="win">
    <div class='win-head'>
      <div class='win-title'>{{ item.label }}</div>
      <div class='close_button' @click="close">&#215;</div>
    </div>
    <component :is="componentName"
      @close-win="close"
      :endpoint="item"
    />
    <div class="win-foot">
    </div>
  </div>
</template>

<script>
export default {
  name: 'win',
  props: {
    item: { type: Object }
  },
  methods: {
    close (e) {
      this.$store.dispatch('closeWin', this.item)
      this.$destroy()
    }
  },
  computed: {
    componentName () {
      if (this.item.endpoint.substr(-7) === '/create' || this.item.endpoint.match(/\d+$/ig) !== null) {
        return 'form-builder'
      } else if (this.item.endpoint.substr(-7) === '/filter') {
        return 'filter-builder'
      } else {
        return 'list-builder'
      } 
    }
  }
}
</script>

<style scoped>
.win {
  background-color: wihte;
  box-shadow: 0 0 2px;
  border-radius: 2px;
  color: gray;
  margin: 5px 0px 2px 0px;
  padding:3px;
 /* overflow: auto; */
  min-width: 430px;
}
.win-head {
  border-radius: 2px;
  background-color: whiteSmoke;
  padding:3px;
}
.win-title {
  font: 12pt sans-serif;
  text-shadow: 0 1px white;
  width: 95%;
  display: inline;
  text-overflow: ellipsis;
}
.close_button {
  float: right;
  text-shadow: 0 1px white;
  cursor: pointer;
  margin-right: 3px;
}
</style>
