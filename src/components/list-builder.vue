<template>
  <div>{{representation}}
    <component :is="toolPanelComponent"
      :disable="activeRow == undefined"
      @add="newElement"
      @edit="editElement"
      @delete="confirmShow=true"
      @filter="openFilterForm"
      @refresh="fetch"
    />
    <search-panel :endpoint="endpoint" @search="fetch"/>

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
      properties: {},
      title: { type: String },
      representation: { type: String }
    }
  },
  computed: {
    pageCount () {
      return this.$store.getters.getPageCount(this.endpoint.key)
    },
    currentPage () {
      return this.$store.getters.getCurrentPage(this.endpoint.key)
    },
    toolPanelComponent () {
      if (this.endpoint.endpoint.split('.')[0] === 'documents') {
        return 'doc-tool-panel'  
      }
      else if (this.endpoint.endpoint.split('.')[0] === 'references') {
        return 'ref-tool-panel'
      }
      else if (this.endpoint.endpoint.split('.')[0] === 'service') {
        return 'ref-tool-panel'
      }
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
        label: this.title + ' Отбор',
        endpoint: this.endpoint.endpoint + '/filter',
        parentKey: this.endpoint.key
      })
    },
    newElement () {
      this.$store.dispatch('openWin', {
        label:  this.title + ' Новый',
        endpoint: this.endpoint.endpoint + '/create'
      })
    },
    editElement () {
      this.$store.dispatch('openWin', {
        label: this.title + ' #' + this.activeRow.id,
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
          sort: this.$store.getters.getSort(this.endpoint.key)
        }
        
      }
      options.params['filter[or][][' + this.representation + '][like]'] = like
      this.$store.dispatch('fetch', { key: key, endpoint: endpoint, options: options })
    }
  },
  created () {
    let s = this.endpoint.endpoint
    this.title = _.get(this.$store.getters.metadata, s + '.title')
    this.representation = _.get(this.$store.getters.metadata, s + '.representation') || undefined
    if (Array.isArray(this.representation)) {
      this.representation = this.representation[0]
    }
    if (this.representation === undefined) {
      if (this.endpoint.endpoint.split('.')[0] === 'documents') {
        this.representation = 'number'
      }
      if (this.endpoint.endpoint.split('.')[0] === 'references') {
        this.representation = 'description'
      }
    }  
    this.properties = _.get(this.$store.getters.metadata, s + '.properties')
    this.requisites = _.get(this.$store.getters.metadata, s + '.attributes')
    for (var key in this.requisites) {
      let tmp = common.parseTypeInfo(this.requisites[key])
      Object.assign(this.requisites[key], tmp)
      if (this.requisites[key].subtype == 'Object') {
        tmp = _.get(this.$store.getters.metadata, this.requisites[key].target + '.representation')
        if (typeof tmp == 'object') {
          this.requisites[key].representation = tmp
        }
      }
    }
    this.fetch()
  }
}
</script>

<style scoped>
</style>
