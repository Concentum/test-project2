<template>
  <div class="hCell" :style="{'min-width':width+'px'}">
    {{ requisite.label }}
    <i v-if="marker" :class="[marker, {'disable':disable}]" aria-hidden="false" @click="$emit('order-by', keyField)" style="float:right"></i>
  </div>
</template>

<script>
import common from '../../common.js'

export default {
  name: 'grid-column-head',
  props: {
    requisite: { type: Object, default: undefined },
    keyField: { type: String, default: '' },
    sort: { type: String }
  },
  computed: {
    disable () {
      return this.marker === 'fa fa-sort'
    },
    marker () {
      if (this.keyField === this.sort) {
        return 'fa fa-caret-up'
      } else if ('-' + this.keyField === this.sort) {
        return 'fa fa-caret-down'
      } else {
        return 'fa fa-sort'
      }
    },
    width () {
      return common.getDefaultColWidth(this.requisite, this.keyField)
    }
  }
}
</script>

<style scoped>
.hCell {
  border: 1px solid white;
  padding:6px;
  margin: 1px 0px 0px 1px;
  background-color: whiteSmoke;
  text-shadow: 0 1px white;
}
.disable {
  color: lightGray;
}
</style>
