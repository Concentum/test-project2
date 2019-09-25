<template>
  <div>
    <div :class="['form-control', 'w-length']">
      <select :id="fieldName" :value="value" @change="change" required>
        <option v-for="(item, idx) in requisite.items" :value="idx">{{item}}</option>
      </select>
      <label :for="fieldName">{{ requisite.label }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'field-enum',
  props: {
    requisite: { type: Object },
    fieldName: { type: String, default: '' },
    endpoint:  { type: Object },
    items: { type: Array }
  },
  methods: {
    change (e) {
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
  width: 382px;
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
