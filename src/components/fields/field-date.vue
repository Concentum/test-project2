<template>
  <div>
    <div :class="'form-control'">
      <input type="text" autocomplete = "off"
        :id="fieldName"
        :value="val"
        :placeholder="placeholder" maxlength="19" @change="change" @keypress="keypress" @keydown="keydown" @input="input">
      <label :for="fieldName">{{ requisite.label }}</label>
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
            <td v-for="day in days" :key="day">{{day}}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 6" :key="i">
            <td v-for="j in 7" :key="j" @click="pickDate">
              <div :class="['wday', {'current': today === i * 7 + j - 7 - begin + 1 }]">
                {{ ((i * 7 + j - 7 >= begin) && (i * 7 + j - 7 - begin + 1 <= total)) ? i * 7 + j - 7 - begin + 1 : '' }}
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

//    format: { type: String, default: 'YYYY-MM-DD hh:mm:ss' },
//    mask: { type: String, default: '####.##.## ##:##:##' }

    local: { type: String, default: 'ru' },
    monday: { type: Number, default: 0 },
    placeholder: { type: String, default: '' },
    
  },
  data () {
    return {
      show: false,
      months: {
        'ru': ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        'en': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        'de': ['Jan', 'Feb', 'Mae', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
      },
      now: undefined
    }
  },
  watch: { 
    val (v) {
      if (v === undefined) {
        return
      }
      if (/^\d{4}$/.test(v)) {
        this.val += '-'
      }  
      if (/^\d{4}-\d{2}$/.test(v)) {
        this.val += '-'
      } 
      if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
        this.val += ' '
      } 
      if (/^\d{4}-\d{2}-\d{2} \d{2}$/.test(v)) {
        this.val += ':'
      } 
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(v)) {
        this.val += ':'
      }
    }
  },
  computed: {
    val: {
      get () {
        let v = this.$store.getters.getRequisiteValue(this.endpoint.key, this.fieldName) || undefined
        this.now = v !== undefined ? new Date(v) : new(Date)
        return v
      },
      set (value) {
        this.$store.commit('setRequisiteValue', {
          key: this.endpoint.key,
          requisite: this.fieldName,
          value: value
        })
      }
    },
    days () {
      let days = {
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
      let d = new Date(this.now.getFullYear(), this.now.getMonth())
      return this.monday === 0 ? (d.getDay() === 0 ? d.getDay() + 7 : d.getDay()) : d.getDay() + 1
    },
    total () {
      return new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0).getDate()
    }
  },
  methods: {
    format (d) {
      return  d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + ' ' +
      ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2)
    },
    input (e) {
      let sS = e.target.selectionStart
      let sE = e.target.selectionEnd
      if (['-', ':', ' '].includes(e.target.value[sS])) {
        sS++ 
      }
      e.target.selectionStart = sS
      e.target.selectionEnd = sS
    },
    keydown (e) {
      if (e.keyCode == 27) {
        e.target.value = this.val
      }
    },  
    keypress (e) {
      if (e.keyCode < 47 || e.keyCode > 57) {
        e.preventDefault()
      } else if (e.target.value.length == 19) {
        let s = e.target.value
        let sS = e.target.selectionStart
        let sE = e.target.selectionEnd
        e.target.value = s.slice(0, e.target.selectionStart) + s.slice(sS+1)
        
        e.target.selectionStart = sS
        e.target.selectionEnd = sS
      }
    },
    change (e) {
      this.now =  !isNaN(new Date(e.target.value).getTime()) ? new Date(e.target.value) : new Date()
      this.val = this.format(this.now)//this.now.toISOString().split('.')[0].replace('T', ' ') //this.now.toLocaleDateString(this.local)
    },
    close () {
      this.now = new Date(this.val)
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
      this.val = this.format(this.now)//this.now.toISOString().split('.')[0].replace('T', ' ') //this.now.toLocaleDateString(this.local)
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
  position: absolute;
  display: inline-block;
  margin-left: -28px; 
  margin-top: 28px; 
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
