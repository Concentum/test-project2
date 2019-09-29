<template>
  <div class="wrap">
    <table class="grid">
      <thead>
        <tr>
          <th v-for="(requisite, key) in requisites" :key="key" :style="{width: width(requisite, key)}">
            <grid-column-head
              :requisite="requisite"
              :keyField="key"
              :sortFieldKey="sortFieldKey"
              :sort="sort"
              @order-by="orderBy"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, key) in rows" :key="key">
          <td v-for="(requisite, key) in requisites" :key="key">
            <div :class="['dCell', {'active': row == activeRow}]"
              @click="$emit('active-row', row)"
              @mousedown.stop="noselect" @selectstart.stop="noselect"
              @dblclick="dblclick">
              <i v-if="requisite.type === 'boolean' && row[key]" class="fa fa-check" aria-hidden="true"></i>
              <template v-else>{{ viewValue(row[key], key) }}</template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'grid',
  props: {
    requisites: { type: Object },
    endpoint: { type: Object },
    activeRow: { type: Object }
  },
  data () {
    return {
      sortFieldKey: undefined
    }
  },
  computed: {
    sort () {
      return this.$store.getters.getSort(this.endpoint.key)
    },
    rows () {
      return this.$store.getters.getDataRows(this.endpoint.key)
    }
  },
  methods: {
    orderBy (key) {
      this.$store.dispatch('sort', { key: this.endpoint.key, requisite: key })
    },
    dblclick (e) {
      if (this.endpoint.targetRequisite !== undefined) {
        this.$emit('selected')
      } else this.$emit('edit')
    },
    width (requisite, key) {
      if (requisite.type === 'date' || requisite.type === 'datetime') {
        return '142px'
      } else if (requisite.type === 'integer') {
        return '100px'
      } else if (key === 'status') {
        return '80px'
      }
    },
    viewValue (value, key) {
      if (value === null || value === undefined || value === '') {
        return ''
      }
      if (value !== null && typeof value === 'object') {
        if (typeof this.requisites[key].representation === 'object') {
          let arr = this.requisites[key].representation
          let result = ''
          for (key in arr) {
            result = result + ' ' + value[arr[key]]
          }  
          return result
        } else {
          return value.description || undefined
        }  
      }
      if (this.requisites[key].type === 'timestamp') {
        return moment(value).format('YYYY-MM-DD hh:mm:ss')
      }
      if (this.requisites[key].type === 'enum') {
        return this.requisites[key]['items'][value]
      }
      return value
    },
    noselect (e) {
      return false
    }
  }
}
</script>

<style scoped>
* {
  -moz-user-select: none;
  -khtml-user-select: none;
}
.wrap {
  min-width: 420px;
  overflow-x: auto;
}
.grid {
  width: 100%;
  font: 9pt verdana;
  border-collapse: collapse;
  cursor: default;
  border: 1px solid lightGray;
}
.grid th {
  color: gray;
  padding: 0;
  margin: 0;
  font-weight: normal;
  border: 1px solid lightGray;
}
.grid td {
  color: gray;
  padding: 0;
  margin: 0;
  height: 28px;
  border: 1px solid lightGray;
  border-right: 0;
  border-left: 0;
}
.dCell {
  -moz-user-select: none;
  -khtml-user-select: none;

  border: 1px solid white;
  padding: 4px;
  margin: 1px 0px 0px 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 100%;
}
.dCell.active {
  background-color: GhostWhite; /*mintCream;*/
  color: darkSlateGray;/*dimGray;*/
}
</style>
