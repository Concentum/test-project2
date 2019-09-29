<template>
  <div>
    <div v-for="(item, i) in slots" :class="'tab-button'" @click="tabSwitch(i)">
      {{item}}
    </div>  
    <template v-for="(item, i) in tabs" :class="'tab-panel'">
      <div v-show="(i === current)">
        {{item}}
      </div>
    </template>  
  </div>
</template>

<script>
export default {
  name: 'tab-list',
  props: {
    slots: { type: Array }
  },
  methods: {
    tabSwitch (i) {
      this.current = i  
    }
  }
}
</script>

<style scoped>
.tab-button {
  display: inline;
  cursor: default;
}
.tab-panel {
}
</style>
 