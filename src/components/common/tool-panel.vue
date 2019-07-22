<template>
  <div class="tool-panel">
    <div class="button"><i class="fa fa-plus" aria-hidden="true" @click="$emit('add')"></i></div>
    <div class="button"><i :class="['fa fa-pencil', {'disable': disable}]" aria-hidden="true" @click="$emit('edit')"></i></div>
    <div class="button"><i :class="['fa fa-trash-o', {'disable': disable}]" aria-hidden="true" @click="$emit('delete')"></i></div>
    <div class="button"><i class="fa fa-filter" aria-hidden="true" @click="$emit('filter')"></i></div>
    <div class="button"><i class="fa fa-refresh" aria-hidden="true" @click="$emit('refresh')"></i></div>
  </div>
</template>

<script>
export default {
  name: 'tool-panel',
  props: {
    disable: { type: Boolean, default: true }
  }
}
</script>

<style scoped lang="scss">
/* @import "~font-awesome/css/font-awesome.min.css";*/

.tool-panel {
  margin: 5px;
  display: inline-block;
}
.button {
  display: inline-block;
  background-color: white;
  border: none;
  color: gray;
  font-size: 16px;
  padding: 6px;
}
.disable {
  color: lightGray;
}
</style>
