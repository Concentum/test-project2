<template>
  <div ref="drap" class="drap" :style="{'top':pR.top+'px', 'left':pR.left+'px', 'height':pR.height+'px', 'width':pR.width+'px'}">
    <div class="child-win" :style="{'top':top+'px', 'left':left+'px', /* 'height':height+'px',*/ 'width':width+'px'}">
      <div class='win-head'>
        <div class='win-title'>
          <slot name="title">&nbsp;</slot>
        </div>
        <div class='close-button' @click="$emit('confirm-cancel')">&#215;</div>
      </div>
    <div class="question">
      <slot name="content"></slot>
    </div>
      <div class="win-foot">
        <slot name="buttons">
          <button ref="cancel" class="confirm-button" @click="$emit('confirm-cancel')" @keyup.enter="enter" @keyup.esc="esc">Cancel</button>
          <button class="confirm-button" @click="$emit('confirm-ok')" @keyup.enter="enter" @keyup.esc="esc">Ok</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal',
  props: {
    title: { type: String, default: '' },
    question: { type: String, default: '' },
    width: { type: Number, default: 250 },
    height: { type: Number, default: 110 }
  },
  data () {
    return {
      pR: {},
      top: 0,
      left: 0
    }
  },
  methods: {
    enter () {
      this.$emit('confirm-ok')
    },
    esc () {
      this.$emit('confirm-cancel')
    },
    resize () {
      this.pR = this.$refs.drap.parentNode.parentNode.getBoundingClientRect()
      this.top = Math.floor(this.pR.height / 2 - this.height / 2)
      this.left = Math.floor(this.pR.width / 2 - this.width / 2)
    }
  },
  destroyed () {
    window.removeEventListener('resize', this.resize)
  },
  activated () {
    this.resize()
  },
  mounted () {
    window.addEventListener('resize', this.resize)
    this.resize()
    this.$refs.cancel.focus()
  }
}
</script>

<style scoped>
.drap {
  position: absolute;
/* background-color: rgba(0, 0, 0, .05); */
}
.child-win {
  position: absolute;
  background-color: white;
  box-shadow: 0 0 5px;
  border-radius: 3px;
  color: gray;
  margin: 5px 0px 2px 0px;
  padding:3px;
  font: 12pt sans-serif;
}
.win-head {
  border-radius: 2px;
  background-color: whiteSmoke;
  padding: 3px;
}
.win-title {
  font: 12pt sans-serif;
  text-shadow: 0 1px white;
  width:95%;
  display: inline;
  text-overflow: ellipsis;
}
.win-foot {
  text-align: center;
  /*padding: 3px;*/
}
.close-button {
  float: right;
  text-shadow: 0 1px white;
  cursor: pointer;
  margin-right: 3px;
}
.question {
  padding: 20px;
  text-align: center;
}
button {
  min-width: 60px;
  margin: 4px 4px 10px 4px;
}
</style>
