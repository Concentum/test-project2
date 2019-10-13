<template>
  <div class="requisite">
    <component :is="componentName" 
      :fieldName="fieldName"
      :requisite="requisite"
      :val="val"
      :endpoint="endpoint"
      @open-reference="openReference"
    />
  </div>  
</template>

<script>
export default {
  name: 'form-field',
  props: {
    fieldName: { type: String },
    requisite: { type: Object },
    endpoint: { type: Object },
    val: {}
  },
  computed: {
    componentName () {
      if (this.requisite.subtype === 'Object') {
        return 'field-object'
      } else if (this.requisite.subtype === 'Date') {
        return 'field-date'
      } else if (this.requisite.subtype === 'String') {
        return 'field-string'
      } else if (this.requisite.subtype === 'Number') {
        return 'field-number'
      } else if (this.requisite.subtype === 'Boolean') {
        return 'field-boolean'
      } else if (this.requisite.subtype === 'Enum') {
        return 'field-enum'
      }
    }
  },
  methods: {
    openReference (requisite, key) {
      this.$store.dispatch('openWin', { 
        label: requisite.label + ' Выбор', 
        endpoint: requisite.target,
        parentKey: this.endpoint.key,
        targetRequisite: key,
        filter: requisite.filter
      })
    }
  }
}
</script>

<style scoped>
.requisite {
  display: inline-block;
}
</style>