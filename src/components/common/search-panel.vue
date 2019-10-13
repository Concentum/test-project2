<template>
  <div class="search-panel">
    <input v-model="search">
    <div class="button-clear" v-show="search" @click="clear"><span>×</span></div>
  </div>
</template>

<script>

import _ from 'lodash'
export default {
  name: 'search-panel',
  props: {
    endpoint: { type: Object }
  },
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
      if (newVal.length > 0 && newVal.length < 3) {
        return
      }
      let filter = {}
      if (newVal.length > 0) {
        let s = this.endpoint.endpoint
        let requisites = _.get(this.$store.getters.metadata, s + '.attributes')
        let representation = _.get(this.$store.getters.metadata, s + '.representation') || undefined
        if ('code' in requisites) {
          filter['code'] = {'or': {'like': newVal}}
        }
        if ('description' in requisites) {
          filter['description'] = {'or': {'like': newVal}}
        }
        if (representation !== undefined) {
          filter[representation] = {'or': {'like': newVal}}
        }
        if (s.split('.')[0] === 'documents' && "number" in requisites) {
          filter['number'] = {'or': {'like': newVal}}
        }
      }      
      this.$store.dispatch('filter', { filter: filter, key: this.endpoint.key })
      this.$emit('search')
    }, 1000)
  }
}
</script>

<style scoped lang="scss">
.search-panel {
  margin: 5px;
  display: inline; 
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
  margin-left: -14px; 
  cursor: default;
}
</style>
