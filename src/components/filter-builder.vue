<template>
  <div>
    <table>
      <tr v-for="(requisite, key) in requisites" :key="key">
        <td>
          <div class="form-control">
            <select v-model="logicConditions[key]" :id="'logic-' + key">
              <option v-for="(item, idx) in logicItems" :value="idx">
                {{ item }}
              </option>
            </select>
            <label :for="'logic-' + key">Условие</label>
          </div>
        </td>
        <td>
          <div class = "form-control">
            <select v-model="conditions[key]" :id="'filter-' + key">
              <option v-for="(item, idx) in conditionItems[conditionIndex(requisite.subtype)]" :value="idx">
                {{ item }}
              </option>
            </select>
            <label :for="'filter-' + key">Вид сравнения</label>
          </div>
        </td>
        <td>
          <form-field
            :fieldName="key"
            :requisite="requisite"
            :endpoint="endpoint"
          />
          <form-field v-if="conditions[key]=='between' && (requisite.subtype == 'Date' || requisite.subtype == 'Number')"
            :fieldName="key + '-end-interval'"
            :requisite="extRequsites[key + '-end-interval']"
            :endpoint="endpoint"
          />  
        </td>
      </tr>
    </table>
    <div>  
      <button class="confirm-button" @click="applyFilter">Apply</button>
      <button class="confirm-button" @click="resetFilter">Reset</button>
      <button class="confirm-button" @click="close">Close</button>
    </div>  
  </div>
</template>

<script>
import common from '../common.js'
import _ from 'lodash'
import moment from 'moment'
 
export default {
  name: 'filter-builder',
  props: {
    endpoint: { type: Object }
  },
  data () {
    return {
      parentEndpoint: '',
      requisites: {},
      extRequsites: {},
      logicConditions: {},
      conditions: {},
      logicItems: ['and', 'or'],
      conditionItems: [
        {'eq':'Равно', 'neq':'Неравно', 'like':'Содержит', 'nlike':'Не содержит', 'like_':'Начинается с', '_like':'Заканчивается на'},
        {'eq':'Равно', 'neq':'Неравно', 'gt':'Больше', 'gte':'Больше или равно', 'lt':'Меньше', 'lte':'Меньше или равно', 'between':'Между'},
        {'eq':'Равно', 'neq':'Неравно'},
        {'eq':'Равно', 'neq':'Неравно'}
      ]

    }
  },
  methods: {
    conditionIndex (val) {
      if (val == 'String') {
        return 0
      } else if (val == 'Date' || val == 'Number') {
        return 1
      } else if (val == 'Object') {
        return 2
      } else if (val == 'Boolean' || val == 'Enum') {
        return 3
      }
    }, 
    resetFilter () {
      this.$store.dispatch('filter', { filter: {}, key: this.endpoint.parentKey })
      let options = {
        params: {
          sort: this.$store.getters.getSort(this.endpoint.key),
        }
      } 
      this.$store.dispatch('fetch', { key: this.endpoint.parentKey, endpoint: this.parentEndpoint.split('.').pop().replace(/_/g, '-'), options: options }) 
    },
    applyFilter () {
      var filters = {}
      for (var i in this.requisites) {
        if (this.logicConditions[i] !== undefined) {
          filters[i] = {}
          var c = this.logicItems[this.logicConditions[i]]
          if (this.conditions[i] === 'between') {
            let a = this.$store.getters.getRequisiteValue(this.endpoint.key, i)
            a = a instanceof Date ? a.toISOString().split('.')[0].replace('T', ' ') : a
            let b = this.$store.getters.getRequisiteValue(this.endpoint.key, i + '-end-interval')
            b = b instanceof Date ? b.toISOString().split('.')[0].replace('T', ' ') : b
            filters[i][c] = { 
              'gte': a, 
              'lte': b
            }
          } else {
            filters[i][c] = {} 
            filters[i][c][this.conditions[i]] = this.$store.getters.getRequisiteValue(this.endpoint.key, i)
          }
        }
      } 
      this.$store.dispatch('filter', { filter: filters, key: this.endpoint.parentKey })
      let options = {
        params: {
          sort: this.$store.getters.getSort(this.endpoint.key),
        }
      } 
      this.$store.dispatch('fetch', { key: this.endpoint.parentKey, endpoint: this.parentEndpoint.split('.').pop().replace(/_/g, '-'), options: options }) 
    },
    close () {
      this.$emit('close-win')
    }
  },  
  created () {
    this.parentEndpoint = this.endpoint.endpoint.replace(/\/filter$/, '').replace(/\/\d+$/ig, '')
    this.requisites = _.get(this.$store.getters.metadata, this.parentEndpoint + '.attributes')

    for (let i in this.requisites) {
      this.$set(this.logicConditions, undefined)
      this.$set(this.conditions, i, undefined)
    }  
    var blanks = common.getBlankObject(this.requisites)
    let vals = this.$store.getters.getFilter(this.endpoint.parentKey)
    
    var x = {}
    for (var i in this.requisites) {
      if (vals !==undefined && vals[i] !== undefined) {
        this.$set(this.logicConditions, i, this.logicItems.indexOf(Object.keys(vals[i])[0]))
        let tmp = Object.keys(Object.values(vals[i])[0])[0] === 'gte' && Object.keys(Object.values(vals[i])[0])[1] === 'lte' ? 'between' : Object.keys(Object.values(vals[i])[0])[0]
        this.$set(this.conditions, i, tmp)
        if (tmp == 'between') {
          this.$set(this.extRequsites, i + '-end-interval', this.requisites[i])
          x[i] = Object.values(Object.values(vals[i])[0])[0] || undefined,
          x[i + '-end-interval'] = Object.values(Object.values(vals[i])[0])[1] || undefined 
        } else {
          x[i] = Object.values(Object.values(vals[i])[0])[0] || undefined
        }
      } else {
        if (this.requisites[i].subtype === 'Date' || this.requisites[i].subtype === 'Number') {
          this.$set(this.extRequsites, i + '-end-interval', this.requisites[i])
          x[i] = blanks[i]
          x[i + '-end-interval'] = blanks[i]
        }else {
          x[i] = blanks[i]
        }
      }
    }
    this.$store.commit('setData', { key: this.endpoint.key, data: x })
      
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
  width: 130px;
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
