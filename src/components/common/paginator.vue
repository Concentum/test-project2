<template>
  <nav>
    <ul class="pagination">
      <li v-for="(page, idx) in pages" :key="idx" :class="['page-item', {'active': page === curr, disabled: page === '...'}]">
        <a v-if="page!='...'" class="page-link" @click="click">{{page}}</a>
        <span v-else class="page-link">{{page}}</span>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'paginator',
  props: {
    c: { type: Number, default: 1 },
    m: { type: Number, default: 1 }
  },
  data () {
    return {
      curr: this.c
    }
  },
  methods: {
    click (e) {
      this.curr = Number(e.target.text)
      this.$emit('page-change', this.curr)
    }
  },
  computed: {
    pages () {
      let current = this.curr
      let last = this.m
      let delta = 2
      let left = current - delta
      let right = current + delta + 1
      let range = []
      let rangeWithDots = []
      let l
      for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
          range.push(i);
        }
      }
      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }
      return rangeWithDots;
    }
  }
}
</script>

<style scoped>
.page-item {
  display: inline;
  font: 10pt sans-serif;
  cursor: default;
  background-color: white;
  box-shadow: 0 0 2px;
  border-radius: 2px;
  border: 1px solid white;
  color: gray;
  padding: 1px 4px 1px 4px;
  margin: 2px;
}
.page-item.active {
  background-color: whiteSmoke;
  text-shadow: 0 1px white;
}
</style>
