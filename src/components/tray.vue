<template>
  <div class="tray">
    <template v-if="current">
      <div v-for="item in items" :key="item.key" @click="click(item)" :class="['tray-item', {active: item.key === current.key}]">
        <span :href="item.endpoint">{{ item.label }}</span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'tray',
  props: {
    items: { type: Array },
    current: { type: Object }
  },
  methods: {
    click (item) {
      this.$emit('open-win', item)
    }
  }
}
</script>

<style scoped>
.tray {
  text-align: left;
}
.tray-item {
  background-color: white;
  box-shadow: 0 0 2px;
  border-radius: 2px;
  color: gray;
  cursor: default;
  display: inline-block;
  font: 10pt sans-serif;
  padding: 3px;
  margin:3px 3px 1px 1px;
  border: 1px solid white;
}
.tray-item.active {
  background-color: whiteSmoke;
  text-shadow: 0 1px white;
}
</style>
