<template>
  <div>
    <div :class="['form-control', 'w-length']">
      <input type="hidden" :value="value">
      <input type="text" required  ref="input" autocomplete = "off"
        :id="fieldName"
        :value="value"
        @input="input" 
        @dblclick="dblclick"    
        @blur="blur"
        @focus="focus"
        @keydown="keydown"
      />
      <label :for="fieldName">{{ requisite.label }}</label>
    </div>
    <div class="button-req" v-if="requisite.subtype==='Object'" @click="$emit('open-reference', requisite, fieldName)">
      <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
    </div>
    <ul v-show="open" class="dropdown-list scrollable-list" ref="list" :style="{width: width+'px'}">
      <li v-for="(item, idx) in items_" @click="pick(item)" :key="idx" :id="item.id" :class="['dd-item', {'active': activeIndex === idx}]"
        @mouseenter="activeIndex = idx" @mouseleave="activeIndex = -1">
          {{item.description}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'field-object',
  props: {
    requisite: { type: Object },
    fieldName: { type: String },
    endpoint:  { type: Object }
  },
  data () {
    return { 
      open: false,
      width: 100,
      items_: [],
      activeIndex: -1,
      value: this.storeValue().description
    }
  },
  computed: {
    calc () {
      if (this.value !== this.storeValue().description) {
        this.value = this.storeValue().description
      }
      return this.storeValue().description
    }
  },
  watch: {
    value: _.debounce(function (val) {
      if (val !== '') {
        let options = {
          params: {
            q: val
          }
        }
        /*
        let endpoint = this.requisite.type.split(".").pop().replace(/_/g, "-")+'/search'
        axios.get('http://api.yii2-sklad/api/' + endpoint, options).then((response) => {
          this.items_ = response.data
          this.show(this.checkNeedOpen())
        }).catch(e => {
        }) 
        */
        this.$store.dispatch('search', { key: key, endpoint: endpoint, options: options })
      }  
    }, 500)
  }, 
  methods: {
    storeValue () {
      return this.$store.getters.getRequisiteValue(this.endpoint.key, this.fieldName)
    },
    dblclick(e) {
      e.target.select()
    },
    input (e) {
      this.$emit('modify')
      this.value = e.target.value
    },
    close () {
      this.open = false
    },
    checkNeedOpen () {
      let val = this.$store.getters.getRequisiteValue(this.endpoint.key, this.fieldName)
      if (val.description !== undefined) {
        if (val.description === this.value) {
          return false
        } else {
          return true
        }
      } else {
        return this.items_.length > 0
      }  
    },
    focus (e) {
      this.show(this.checkNeedOpen())
    },
    blur (e) {
      setTimeout(this.close, 200)
    },
    pick (item) {
      this.$store.commit('setRequisiteValue', {
        key: this.endpoint.key,
        requisite: this.fieldName,
        value: item
      })
      this.value = item.description
      this.$refs.input.focus()
      this.activeIndex = -1
      this.close()
    },
    show (visible) {
      this.width = this.$refs.input.getBoundingClientRect().width
      this.open = visible
    },
    keydown (e) {
      if ([38, 40, 27, 13, 9].includes(e.keyCode)) {
        switch (e.keyCode) {
          case 38:// up
            this.prev()
            break
          case 40:// down
            this.next()
            break
          case 13:// enter
            if (this.activeIndex !== -1) {
              this.$refs.list.childNodes[this.activeIndex].click()
            }
            break
          case 27:// escape
            this.value = this.storeValue().description
            this.close()
            break
        }
      }
    },
    prev () {
      if (this.activeIndex > 0) {
        this.activeIndex--
        if (this.$refs.list.scrollTop > 0) {
          var elem = this.$refs.list.childNodes[this.activeIndex]
          var curPos = elem.getBoundingClientRect()
          var listPos = this.$refs.list.getBoundingClientRect()
          this.$refs.list.scrollTop += curPos.top - listPos.top
        }
      }
    },
    next () {
      if (this.activeIndex < this.items_.length - 1) {
        this.activeIndex++
        var elem = this.$refs.list.childNodes[this.activeIndex]
        var curPos = elem.getBoundingClientRect()
        var listPos = this.$refs.list.getBoundingClientRect()
        this.$refs.list.scrollTop = (this.$refs.list.scrollTop + curPos.bottom) - listPos.bottom
        if (this.activeIndex === this.items_.length - 1) this.$refs.list.scrollTop = this.$refs.list.scrollHeight
      }
    }
  }
}
</script>

<style scoped>
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
  width: 18px;
  text-align: center;
  background-color: white;
  color: darkGray;
}
li.dd-item {
  font-size: 14px;
  padding: 5px 10px;
}
li.active {
  background-color: #53A4EA;
  color: #fff;
  cursor: default;
}
.dropdown-list {
  position: absolute;
  width: 100%;
  min-width: 10rem;
  padding: .5rem 0;
  margin: 3px 0px 0px 4px;
 /* margin: .125rem 0 0;*/
  background-color: #fff;
  border: 1px solid rgba(0,0,0,.15);
  border-radius: .25rem;
  z-index: 1000;
  list-style: none;
}
.scrollable-list {
  height: auto;
  max-height: 175px;
  overflow-x: hidden;
}
</style>
