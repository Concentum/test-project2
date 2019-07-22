<template>
  <div>
    <div :class="'form-control'">
      <input type="text" autocomplete = "off"
        :id="fieldName"
        :value="pickedValue"
        :placeholder="placeholder" maxlength="20" @change="change" @input="input" required>
      <label :for="fieldName">{{ requisite.alias }}</label>
    </div>
    <div class="button-req"><i @click="show = !show" class="fa fa-calendar-o" aria-hidden="true"></i></div>

    <div v-show="show" class="clndr">
      <table>
        <thead>
          <tr>
            <td @click="yearClick(-1)">«</td>
            <td @click="monthClick(-1)">‹</td>
            <td colspan="3">{{months[local][now.getMonth()]}} {{now.getFullYear()}}</td>
            <td @click="monthClick(1)">›</td>
            <td @click="yearClick(1)">»</td>
          </tr>
          <tr class="clndr-days">
            <td v-for="day in days">{{day}}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 6">
            <td v-for="j in 7" @click="pickDate">
              <div :class="['wday', {'current': today === i * 7 + j - 7 - begin + 1 }]">
                {{ (i * 7 + j - 7 >= begin) && (i * 7 + j - 7 - begin + 1 <= total) ? i * 7 + j - 7 - begin + 1 : '' }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'field-date',
  props: {
    requisite: { type: Object },
    fieldName: { type: String, default: '' },
    endpoint:  { type: Object },

    name: { type: String,	default: '' },
    format: { type: String, default: 'DD-MM-YYYY' },
    local: { type: String, default: 'en' },
    monday: { type: Number, default: 0 },
    placeholder: { type: String, default: '' },
    mask: { type: String, default: '##.##.####' }
  },
  data () {
    return {
      show: false,
      months: {
        'ru': ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        'en': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        'de': ['Jan', 'Feb', 'Mae', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
      },
      old: this.storeValue() !== undefined ? new Date(this.storeValue()) : new Date(),
      now: this.storeValue() !== undefined ? new Date(this.storeValue()) : new Date(),
      pickedValue: this.storeValue() !== undefined ? new Date(this.storeValue()).toLocaleDateString() : undefined
    }
  },
  computed: {
    days () {
      var days = {
        'ru': ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        'en': ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        'de': ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
      }
      return this.monday === 0 ? days[this.local] : days[this.local].slice(6, 7).concat(days[this.local].slice(0, 6))
    },
    today () {
      return this.now.getDate()
    },
    begin () {
      var d = new Date(this.now.getFullYear(), this.now.getMonth())
      return this.monday === 0 ? (d.getDay() === 0 ? d.getDay() + 7 : d.getDay()) : d.getDay() + 1
    },
    total () {
      return new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0).getDate()
    }
  },
  methods: {
    storeValue () {
      return this.$store.getters.getRequisiteValue(this.endpoint.key, this.fieldName)
    },
    input (e) {
      var str = e.target.value
      var m = str.match(/^(\d{2})(\d{2})(\d{4})$/)
      if (m !== null) {
        this.now = new Date(m[3], m[2] - 1, m[1])
        this.pickedValue = this.now.toLocaleDateString()
      }
    },
    change (e) {
      this.now = new Date(e.target.value)
      this.pickedValue = this.now.toLocaleDateString()
    },
    close () {
      this.now = this.old
      this.show = false
    },
    yearClick (flag) {
      this.now = new Date(this.now.getFullYear() + flag, this.now.getMonth(), this.now.getDate())
    },
    monthClick (flag) {
      this.now = new Date(this.now.getFullYear(), this.now.getMonth() + flag, this.now.getDate())
    },
    pickDate (e) {
      this.show = false
      this.now = e.target.innerText !== '' ? new Date(this.now.getFullYear(), this.now.getMonth(), e.target.innerText) : this.now
      this.old = this.now
      this.pickedValue = this.now.toLocaleDateString()
    },
    leave (e) {
      if (!this.$el.contains(e.target)) {
        this.close()
      }
    }
  },
  mounted () {
    document.addEventListener('click', this.leave, false)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.leave, false)
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
.button-req {
  position: relative;
  display: inline-block;
  margin-left: -30px;
  cursor: default;
/* border: 1px solid lightGray;
  border-radius: 3px; */
  width: 18px;
  text-align: center;
  background-color: white;
  color: darkGray;
}
.clndr table {
  width: 100%;
  text-align: center;
}
.clndr {
  position: absolute;
  min-width: 200px;
  margin: 3px 0px 0px 6px;
  cursor: default;
  border-radius: 4px;
  font: 15px  sans-serif;
  background: white;
  box-shadow: 0 0 3px;
  z-index: 1000;
}
.wday {
  color: gray;
  font-size: 14px;
  padding:2px;
  margin:2px;
}
.current {
  color: black;
  background-color: Gainsboro;
  font-size: 14px;
  border-radius: 3px;
}
</style>
