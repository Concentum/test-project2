<template>
  <div>
    <table>
      <tr v-for="(requisite, key) in requisites" :key="key">
        <td>
          <filter-condition :value="requisite.subtype" :fieldName="key"/>
        </td>
        <td>
          <form-field
            :fieldName="key"
            :requisite="requisite"
            :endpoint="endpoint"
          />
        </td>
      </tr>
    </table>

    <div>  
      <button class="confirm-button" @click="resetFilter">Reset</button>
      <button class="confirm-button" @click="applyFilter">Ok</button>
      <button class="confirm-button" @click="close">Cancel</button>
    </div>  
  </div>
</template>

<script>
import metadata from '../metadata.json'
import common from '../common.js'
import _ from 'lodash'
import moment from 'moment'
 
export default {
  name: 'form-builder',
  props: {
    endpoint: { type: Object }
  },
  data () {
    return {
      requisites: { type: Object },
    }
  },
  computed: {
  },
  methods: {
    resetFilter () {
    },
    applyFilter () {
      this.$emit('close-win')
    },
    close () {
      this.$emit('close-win')
    }
  },  
  created () {
    let path = this.endpoint.endpoint.replace(/\/filter$/, '').replace(/\/\d+$/ig, '')
    this.properties = _.get(metadata, path + '.properties')
    this.requisites = _.get(metadata, path + '.requisites')
    for (var key in this.requisites) {
      let tmp = common.parseTypeInfo(this.requisites[key].type)
      Object.assign(this.requisites[key], tmp)
    }
    let data = []
    for (var key in this.requisites) {
      if (this.requisites[key].subtype === 'Object') {
        data[key] = {}
      } else if (this.requisites[key].subtype === 'Number') {
        data[key] = 0
      } else if  (this.requisites[key].subtype === 'String') {
        data[key] = ''
      }  
    }
    this.$store.commit('setData', { key: this.endpoint.key, data: data })
  }  
}
</script>

<style scoped>
button {
  min-width: 60px;
  margin: 20px 4px 10px 4px;
  height: 25px;
}
</style>
