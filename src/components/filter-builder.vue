<template>
  <div>
    <table>
      <tr v-for="(requisite, key) in requisites" :key="key">
        <td>
          <div class="form-control">
            <select :id="'logic-'+ requisite" required>
              <option :value="idx" v-for="(logic, idx) in logic">
                {{ logic }}
              </option>
            </select>
            <label :for="'logic-' + requisite">Условие</label>
          </div>
        </td>
        <td>
          <filter-condition :value="requisite.subtype" :fieldName="key"/>
        </td>
        <td>
          <form-field
            :fieldName="key"
            :requisite="requisite"
            :endpoint="endpoint"
          />
          <form-field v-if="requisite.subtype == 'Date' || requisite.subtype == 'Number'"
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
      logic: ['AND', 'OR']
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
    this.properties = _.get(this.$store.getters.metadata, path + '.properties')
    this.requisites = _.get(this.$store.getters.metadata, path + '.attributes')
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
.form-control {
  display: inline-block;
  font: 30pt  sans-serif;
  position: relative;
  margin: 5px 5px 0px 5px;
}
.form-control select {
  display: inline-block;
  border: 1px solid lightGray;
  color: gray;
  padding: 4px 4px 4px 4px;
  border-radius: 2px;
  font-size: 14px;
  width: 80px;
} 
.form-control label {
  display: block;
  position: absolute;
  left: 15px;
  top: 22px;
  color: #aaa;
  font-size: 15px;
  -webkit-transition: .1s;
  transition: .1s;
} 
.form-control select:valid + label,
.form-control select:focus + label {
  top: 0;
  font-size: 14px;
  color: gray;
} 
</style>
