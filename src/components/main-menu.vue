<template>
  <div :class="[{'root-menu': isRoot}, {'child-menu': !isRoot}]" style="z-index:1000">
    <div v-for="(item, index) in items" :key="index" :class="['item', {'root-item': isRoot}, {'child-item': !isRoot}]"
      @mouseenter="mouseenter($event, index, item)"
      @mouseleave="mouseleave($event)"
      @click.stop="click($event, item)">
      <span v-if="item.items">{{ item.label }} &#8250;</span>
      <span v-else :href="item.endpoint">
        {{ item.label }}
      <!--  <router-link :to="item.endpoint">{{item.label}}</router-link> -->
      </span>
      <main-menu v-if="item.items" v-bind:items="item.items" v-show="index == activeIndex" @close="close" @open-win="open"></main-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: 'main-menu',
  props: {
    items: { type: Array },
    isRoot: { type: Boolean, default: false }
  },
  data () {
    return {
      activeIndex: -1
    }
  },
  methods: {
    mouseenter (e, index, item) {
      this.activeIndex = index
      if (item.items !== undefined) {
        if (this.isRoot) {
          e.target.lastChild.style.top = e.target.offsetHeight + e.target.offsetTop + 'px'
          e.target.lastChild.style.left = e.target.offsetLeft + 'px'
        } else {
          e.target.lastChild.style.top = e.target.offsetTop + 'px'
          e.target.lastChild.style.left = e.target.offsetLeft + e.target.offsetWidth + 'px'
        }
      }
    },
    mouseleave (e) {
      if (e.relatedTarget == null) return
      if (!e.relatedTarget.classList.contains('child-menu')) {
        this.activeIndex = -1
      }
    },
    click (e, item) {
      if (item.endpoint !== undefined) {
        this.activeIndex = -1
        this.$emit('open-win', item)
        this.$emit('close')
      }
    },
    close () {
      this.activeIndex = -1
      this.$emit('close')
    },
    open (item) {
      this.$emit('open-win', item)
    }
  }
}
</script>

<style scoped>
.root-menu {
  text-align: left;
  background-color: white;
  box-shadow: 0 0 2px;
  border-radius: 2px;
  color: gray;
  margin: 2px 0px 2px 0px;
}
.child-menu {
  position:absolute;
  background-color: white;
  box-shadow: 0 0 2px;
  border-radius: 2px;
}
.item {
  font: 12pt sans-serif;
  color: gray;
  background-color: white;
  margin: 4px;
  padding: 4px;
  border-radius: 2px;
  cursor: default;
}
.root-item {
  display: inline-block;
}
.child-item {
  display: block;
  white-space: nowrap;
}
.item:hover {
  background-color: whiteSmoke;
  text-shadow: 0 1px white;
}
</style>
