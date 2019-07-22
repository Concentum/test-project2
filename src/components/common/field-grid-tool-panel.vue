<template>
  <div class="tool-panel">
    <div class="button"><i class="fa fa-plus" aria-hidden="true" @click="$emit('add')"></i></div>
    <div class="button"><i :class="['fa fa-pencil', {'disable': disable}]" aria-hidden="true" @click="$emit('edit')"></i></div>
    <div class="button"><i :class="['fa fa-times', {'disable': disable}]" aria-hidden="true" @click="$emit('delete')"></i></div>
    <div class="button"><i :class="['fa fa-arrow-up', {'disable': disable}]" aria-hidden="true" @click="$emit('row-up')"></i></div>
    <div class="button"><i :class="['fa fa-arrow-down', {'disable': disable}]" aria-hidden="true" @click="$emit('row-down')"></i></div>
  </div>
</template>

<script>
export default {
  name: 'field-grid-tool-panel',
  props: {
    disable: { type: Boolean, default: true }
  }
}
</script>

<style scoped lang="scss">
@import "~font-awesome/css/font-awesome.min.css";

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

