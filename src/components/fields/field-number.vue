<template>
  <div>
    <div :class="'form-control'">
      <input type="text" :id="fieldName" :value="value" @input="input" required autocomplete = "off">
      <label :for="fieldName">{{ requisite.label }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'field-number',
  props: {
    requisite: { type: Object },
    fieldName: { type: String, default: '' },
    endpoint:  { type: Object }
  },
  methods: {
    input (e) {
      this.value = e.target.value
    }
  },
  computed: {
    value: {
      get () {
        return this.$store.getters.getRequisiteValue(this.endpoint.key, this.fieldName)
      },
      set (value) {
        this.$store.commit('setRequisiteValue', {
          key: this.endpoint.key,
          requisite: this.fieldName,
          value: value
        })
      }
    }
  }
}
</script>

<style scoped>
.requisite {
  display: inline-block;
}
.w-length input {
  /*width: 382px;*/
}
.form-control {
  display: inline-block;
  font: 30pt  sans-serif;
  position: relative;
  margin: 5px 5px 0px 5px;
}
.form-control input {
  display: inline-block;
  border: 1px solid lightGray;
  color: gray;
  padding: 5px 25px 5px 5px;
  border-radius: 2px;
  font-size: 14px;
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
.form-control input:valid + label,
.form-control input:focus + label {
  top: 0;
  font-size: 14px;
  color: gray;
}
</style>
