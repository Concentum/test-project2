<template>
  <div class="tbl scroll-wrap">
    <div class=tbl-row>
      <div class="tbl-cell wrap" ref="scroll" @scroll="scroll" style="height:120px">
        <slot></slot>
      </div>
      <div class="tbl-cell" style="width:10px;">
        <div class="v-scroll" ref="vScroll" @click="vClick">
          <div class="v-slider" ref="vSlider" v-show="vVisible"
            @mousedown = "vMousedown"
            @mouseover = "vMouseover"
            @mouseout = "vMouseout" :style="{'top': vTop()+'px', 'height': vHeight+'%', 'width': vSliderWidth+'px'}">
          </div>
        </div>
      </div>
    </div>
    <div class="tbl-row">
      <div class="tbl-cell" style="height:10px;">
        <div class="h-scroll" ref="hScroll"  @click="hClick">
          <div class="h-slider" ref="hSlider" v-show="hVisible()"
            @mousedown = "hMousedown"
            @mouseover = "hMouseover"
            @mouseout = "hMouseout" :style="{'left': hLeft+'px', 'width': hWidth+'px', 'height': hSliderHeight+'px'}">
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'scroll-wrap',
  props: {
    k: { type: Number },
    current: { type: Number },
    displayed: { type: Number }
  },
  data () {
    return {
      hLeft: 0,
      hWidth: 18,

      vSlide: false,
      hSlide: false,
      hSlideShift: 0,
      vSlideShift: 0,

      hSliderHeight: 3,
      vSliderWidth: 3,
    }
  },
  computed: {
    vVisible () {
      return this.k !== undefined && this.k < 1 && this.k !== Infinity
    },
    vHeight () {
      return this.k !== undefined ? Math.floor(this.k * 100) : undefined
    }
  },
  methods: {
    hVisible () {
      return this.$refs.scroll !== undefined ? this.$refs.scroll.scrollWidth >= this.$refs.scroll.offsetWidth : undefined
    },
    vTop () { 
      if (this.$refs.vScroll !== undefined && this.$refs.vSlider !== undefined) {
        let luft = this.$refs.vScroll.clientHeight - this.$refs.vSlider.offsetHeight // ход ползунка
        let total = this.displayed / this.k //всего записей
        let step = luft / (total - this.displayed)
        return Math.ceil(step * this.current)
      } else {
        return 0
      }
    },
    scroll (e) {
      this.hLeft = Math.floor(e.target.scrollLeft * (this.$refs.scroll.offsetWidth / this.$refs.scroll.scrollWidth))
    },
    hWidthScroll () {
      if (this.$refs.scroll !== undefined) {
        this.hWidth = Math.floor(this.$refs.scroll.clientWidth / (this.$refs.scroll.scrollWidth / this.$refs.scroll.clientWidth))
      }
    },
    setVTop (shift) {
      let vTop
      if (shift >= 0) {
        if (shift <= this.$refs.vScroll.clientHeight - (this.$refs.vSlider.offsetHeight)) {
          vTop = shift
        } else {
          vTop = this.$refs.vScroll.clientHeight - (this.$refs.vSlider.offsetHeight)
        }
      } else {
        vTop = 0
      }
      let x = this.$refs.vScroll.clientHeight - this.$refs.vSlider.offsetHeight
      this.$emit('v-scroll', vTop, this.$refs.vScroll.clientHeight - this.$refs.vSlider.offsetHeight)
    },
    setHLeft (shift) {
      this.$refs.scroll.scrollLeft = Math.floor(shift * this.$refs.scroll.scrollWidth / this.$refs.scroll.offsetWidth)
    },
    vClick (e) {
      this.setVTop(e.pageY - this.$refs.vScroll.offsetTop - Math.floor(this.$refs.vSlider.offsetHeight / 2))
    },
    hClick (e) {
      if (e.target !== this.$refs.hSlider) {
        this.setHLeft(e.pageX - this.$refs.hScroll.offsetLeft - Math.floor(this.hWidth / 2))
      }
    },
    mousemove (e) {
      if (this.vSlide) {
        this.setVTop(e.pageY - this.vSlideShift)
      } else if (this.hSlide) {
        this.setHLeft(e.pageX - this.hSlideShift)
      }
    },
    leave () {
      this.vSlide = false
      this.hSlide = false
      this.hSliderHeight = 3
      this.vSliderWidth = 3
    },
    resize () {
      this.$nextTick(
        this.hWidthScroll
      )
    },
    hMousedown (e) {
      this.hSlide = true
      this.hSlideShift = e.pageX - e.target.offsetLeft
    },
    vMousedown (e) {
      this.vSlide = true
      this.vSlideShift = e.pageY - e.target.offsetTop
    },
    hMouseover (e) {
      this.hSliderHeight = 10
    },
    hMouseout (e) {
      if (!this.hSlide) {
        this.hSliderHeight = 3
      }
    },
    vMouseover (e) {
      this.vSliderWidth = 8
    },
    vMouseout (e) {
      if (!this.vSlide) {
        this.vSliderWidth = 3
      }
    }
  },
  activated () {
    this.$nextTick(
      this.hWidthScroll
    )
  },
  mounted () {
    this.hWidthScroll()
    window.addEventListener('resize', this.resize, false)
    document.addEventListener('mouseup', this.leave, false)
    document.addEventListener('mousemove', this.mousemove, false)
  },
  beforeDestroy () {
    window.removeEventListener('risize', this.resize, false)
    document.removeEventListener('mouseup', this.leave, false)
    document.removeEventListener('mousemove', this.mousemove, false)
  }
}
</script>

<style scoped>
.tbl {
  display: table;
}
.tbl-row {
  display: table-row;
}
.tbl-cell {
  display: table-cell;
}
.wrap {
  max-width: 420px;
  overflow-x: hidden;
  border: 1px solid lightGray;
  vertical-align: top;
}
.scroll-wrap {
  height: 1px;
  width: 100%;
}
.v-scroll {
  position: relative;
  display: block;
  width: 10px;
  height: 100%;
  margin-left: 3px;
  padding: 0;
}
.h-scroll {
  vertical-align: middle;
  position: relative;
  display: block;
  height: 12px;
  margin-top: 3px; /*margin: 0;*/
  padding: 0;
}
.v-slider {
  background-color: whiteSmoke;
  position: relative;
  min-height: 8px;
  border: 1px solid lightGray;
  border-radius: 5px;
}
.h-slider {
  background-color: whiteSmoke;
  position: relative;
  min-width: 8px;
  border: 1px solid lightGray;
  border-radius: 5px;
}
</style>
