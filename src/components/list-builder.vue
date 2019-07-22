<template>
  <div>
    <tool-panel 
      :disable="activeRow == undefined"
      @add="newElement"
      @edit="editElement"
      @delete="confirmShow=true"
      @filter="openFilterForm"
      @refresh="fetch"
    />
    <search-panel @search="fetch"/>

    <grid @active-row="setActiveRow"
      @edit="editElement"
      @selected="selected"
      :requisites="requisites"
      :endpoint="endpoint"
      :activeRow="activeRow"
    />

    <paginator
      :c="currentPage"
      :m="pageCount"
      @page-change="fetch"
    />

    <modal v-if="confirmShow"
      @confirm-cancel="confirmShow=false"
      @confirm-ok="deleteElement">
      <template slot="title">Подтверждение удаления</template>
      <template slot="content">Удалить текущий элемент?</template>
    </modal>
  </div>
</template>

<script>
import metadata from '../metadata.json'
import common from '../common.js'
import _ from 'lodash'

export default {
  name: 'list-builder',
  props: {
    endpoint: { type: Object }
  },
  data () {
    return {
      activeRow: undefined,
      confirmShow: false,
      filterShow: false,
      requisites: {},
      properties: {}
    }
  },
  computed: {
    pageCount () {
      return this.$store.getters.getPageCount(this.endpoint.key)
    },
    currentPage () {
      return this.$store.getters.getCurrentPage(this.endpoint.key)
    }
  },
  methods: {
    selected () {
      this.$store.commit('setRequisiteValue', {
        key: this.endpoint.parentKey,
        requisite: this.endpoint.targetRequisite,
        value: this.activeRow
      })
      this.$emit('close-win')
    },
    setActiveRow (row) {
      this.activeRow = row
    },
    openFilterForm () {
      this.$store.dispatch('openWin', {
        label: this.properties.alias + ' Отбор',
        endpoint: this.endpoint.endpoint + '/filter',
        parentKey: this.endpoint.key
      })
    },
    newElement () {
      this.$store.dispatch('openWin', {
        label: this.properties.alias + ' Новый',
        endpoint: this.endpoint.endpoint + '/create'
      })
    },
    editElement () {
      this.$store.dispatch('openWin', {
        label: this.properties.alias + ' #' + this.activeRow.id,
        endpoint: this.endpoint.endpoint + '/' + this.activeRow.id
      })
    },
    deleteElement () {
      this.confirmShow = false
      this.fetch()
    },
    fetch (page, like, sort) {
      let key = this.endpoint.key
      let endpoint = this.endpoint.endpoint.split('.').pop().replace(/_/g, '-')
      let options = {
        params: {
          page: page,
          like: like,
          sort: this.$store.getters.getSort(this.endpoint.key)
        }
      }
      this.$store.dispatch('fetch', { key: key, endpoint: endpoint, options: options })
    }
  },
  created () {
    this.properties = _.get(metadata, this.endpoint.endpoint + '.properties')
    this.requisites = _.get(metadata, this.endpoint.endpoint + '.requisites')
    for (var key in this.requisites) {
      let tmp = common.parseTypeInfo(this.requisites[key].type)
      Object.assign(this.requisites[key], tmp)
    }
    this.fetch()
  }
}
</script>

<style scoped>
</style>
