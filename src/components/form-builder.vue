<template>
  <div>
    <template v-for="(requisite, key) in requisites">
      <form-field v-if="formData"
        :fieldName="key"
        :requisite="requisite"
        :endpoint="endpoint"
      />
    </template>
    <template v-for="(detail, key) in details">
      <field-grid
        :detailName="key"
        :requisites="detail.requisites"
        :endpoint="endpoint"
      />
    </template>
    <modal v-if="confirmShow"
      @confirm-cancel="confirmShow=false"
      @confirm-yes="saveElement"
      @confirm-no="noSaveElement">
      <template slot="title">Подтверждение закрытия</template>
      <template slot="content">Сохранить текущий элемент?</template>
      <template slot="buttons">
        <button ref="cancel" class="confirm-button" @click="$emit('confirm-cancel')" @keyup.enter="enter" @keyup.esc="esc">Cancel</button>
        <button class="confirm-button" @click="$emit('confirm-yes')" @keyup.enter="enter" @keyup.esc="esc">Yes</button>
        <button class="confirm-button" @click="$emit('confirm-no')" @keyup.enter="enter" @keyup.esc="esc">No</button>
      </template>  
    </modal>
    <div>  
      <button class="confirm-button" @click="saveElement">Ok</button>
      <button class="confirm-button" @click="noSaveElement">Cancel</button>
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
      details: { type: Object },
      isNew: false,
      confirmShow: false
    }
  },
  computed: {
    formData () {
      let data = this.$store.getters.getData(this.endpoint.key)
      if (data !== undefined) {
        return data
      }
    }
  },
  methods: {
    saveElement () {
      this.confirmShow = false
      this.$emit('close-win')
    },
    noSaveElement () {
      this.confirmShow = false
      this.$emit('close-win')
    },
    fetch (id) {
      var options = {
        params: {
          id: id,
          expand: this.details !== undefined ? Object.keys(this.details).join(',') : undefined
        }
      }
      let endpoint = this.endpoint.endpoint.split(".").pop().replace(/_/g, "-") //.split("/")[0]
      this.$store.dispatch('fetch', {
        key: this.endpoint.key, 
        endpoint: endpoint, 
        options: options 
      })
    },
    selectstart (e) {
      e.preventDefault() 
    },
    dragstart (e) {
      e.preventDefault() 
    },
    typeCorrection (requisites) {
      for (var key in requisites) {
        let tmp = common.parseTypeInfo(requisites[key].type)
        Object.assign(requisites[key], tmp)
      }
    }
  },
  created () {
    let path = this.endpoint.endpoint.replace(/\/create$/, '').replace(/\/\d+$/ig, '')
    this.properties = _.get(this.$store.getters.metadata, path + '.properties')
    this.requisites = _.get(this.$store.getters.metadata, path + '.attributes')
    this.details = _.get(this.$store.getters.metadata, path + '.details')
    for (let detail in this.details) {
  //    this.$set(this.details[detail].requisites, 'nstr', {'alias': '№ стр', 'type': 'integer'})
    }
    
    this.typeCorrection(this.requisites)
    for(var key in this.details) {
      this.typeCorrection(this.details[key].requisites)
    }
    let id = this.endpoint.endpoint.match(/\d+$/ig)
    if (id !== undefined && id !== null) {
      this.fetch(id[0])
    } else {
      this.$store.commit('setData', { key: this.endpoint.key, data: common.getBlankObject(this.requisites) })
    }
  },
  activated () {
    if (this.selectedItem !== undefined) {
      this.$set(this.dataFields, this.targetRequisite, this.selectedItem)
    }
  },
  mounted () {
    document.addEventListener('dragstart', this.dragstart, false)
    document.addEventListener('selectstart', this.selectstart, false)
  },
  beforeDestroy () {
    document.removeEventListener('dragstart', this.dragstart, false)
    document.removeEventListener('selectstart', this.selectstart, false)
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
