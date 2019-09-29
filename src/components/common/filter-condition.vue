<template>
  <div class = "form-control">
    <select :id="'filter-'+ fieldName" required>
      <option :value="idx" v-for="(item, idx) in items[index]">
        {{ item }}
      </option>
    </select>
    <label :for="'filter-' + fieldName">Вид сравнения</label>
  </div>
</template>

<script>
export default {
  name: 'filter-condition',
  props: {
    value: { type: String },
    fieldName: { type: String }
  },
  data () {
    return {
      items: [
        ['', 'Равно', 'Неравно', 'Содержит', 'Не содержит', 'Начинается с', 'Заканчивается на'],
        ['', 'Равно', 'Неравно', 'Больше', 'Больше или равно', 'Меньше', 'Меньше или равно', 'Между'],
        ['', 'Равно', 'Неравно'],
        ['', 'Равно', 'Неравно']
      ]
    }
  },
  computed: {
    index () {
      if (this.value == 'String') {
        return 0
      } else if (this.value == 'Date' || this.value == 'Number') {
        return 1
      } else if (this.value == 'Object') {
        return 2
      } else if (this.value == 'Boolean' || this.value == 'Enum') {
        return 3
      }
    } 
  }
}
</script>

<style scoped>
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
  width: 160px;
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
