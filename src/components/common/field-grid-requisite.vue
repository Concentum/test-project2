<template>
  <div class="d-cell" tabindex="1" @dblclick="onDblClick" :style="{'width':width+'px', 'text-align': align}">
    {{ valueView(value) }}
  </div>
</template>

<script>
import common from '../../common.js'

export default {
  name: 'field-grid-requisite',
  props: {
    requisite: { type: Object },
    value: undefined
  },
  computed: {
    align () {
      return common.getDefaultColAlign(this.requisite)
    },
    width () {
      return common.getDefaultColWidth(this.requisite)
    }
  },
  methods: {
    valueView (val) {
      if (typeof val === 'object') {
        return val.description !== undefined ? val.description : null
      } else return val !== undefined ? val : 'null'
    },
    onDblClick (e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>
.d-cell {
  height: 100%;
}
</style>
