<template>
  <div>
    <div :class="['form-control', 'w-length']">
      <input type="text" required  ref="input" autocomplete = "off"
        :id="fieldName"
        :value="calcValue()"
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
          {{item[representation]}}
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
    endpoint:  { type: Object },
  },
  data () {
    return { 
      open: false,
      width: 100,
      items_: [],
      activeIndex: -1,
      value: undefined,
      oldValue: undefined
    }
  },
  created () {
    this.value = this.storeValue
    this.oldValue = this.value
    this.$watch('value', _.debounce(function (val) {
      if (val !== '') {
        let options = {
          params: {}
        }
        if (this.requisite.filter !== undefined) {
          for (let i in this.requisite.filter) {
            options.params['filter['+i+']'] = this.requisite.filter[i]
          }
        }  
        options.params['filter[or][][' + this.representation + '][like]'] = val
        options.params['fields'] = 'id,code,' + this.representation
        let endpoint = this.requisite.class.split(".").pop().replace(/_/g, "-")
        this.$store.dispatch('search', { endpoint: endpoint, options: options }).then((res) => {
          if (res) {
            this.items_ = res.data.items
            this.show(this.checkNeedOpen())
          }  
        })
      }  
    }, 500))
  },  
  computed: {
    representation () {
      return this.requisite.representation || 'description';
    },
    storeValue () {
      let v = this.$store.getters.getRequisiteValue(this.endpoint.key, this.fieldName)
      return v === undefined || v === null ? '' : v[this.representation]
    },
  },
  /*
  watch: {
    value: _.debounce(function (val) {
      if (val !== '') {
        let options = {
          params: {}
        }
        options.params['filter[or][][' + this.representation + '][like]'] = val
        options.params['fields'] = 'id,code,' + this.representation
        let endpoint = this.requisite.class.split(".").pop().replace(/_/g, "-")
        this.$store.dispatch('search', { endpoint: endpoint, options: options }).then((res) => {
          if (res) {
            this.items_ = res.data.items
            this.show(this.checkNeedOpen())
          }  
        })
      }  
    }, 500)
  }, */ 
  methods: {
    calcValue () {
      if (this.value === this.oldValue && this.value === this.storeValue) {
        return this.value
      } else if ((this.value !== this.oldValue) && (this.oldValue === this.storeValue)) {
        return this.value
      } else if ((this.value !== this.oldValue) && (this.value !== this.storeValue)) {
        this.value = this.storeValue
        this.oldValue = this.value  
        return this.value
      } else {
        this.value = this.storeValue
        this.oldValue = this.value  
      }
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
      if (val[this.representation] !== undefined) {
        if (val[this.representation] === this.value) {
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
      this.value = item[this.representation]
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
            this.value = this.storeValue
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
  position: absolute;
  display: inline-block;
  margin-left: -28px;
  margin-top: 28px;
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
