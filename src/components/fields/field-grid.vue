<template>
  <div class="grid-wrap">
    <field-grid-tool-panel
      :disable="currentRow == undefined"
      @add="add"
      @edit="edit"
      @delete="remove"
      @row-up="rowUp"
      @row-down="rowDown"
    />
  <div>
    <scroll-wrap :k="k" :current="idx" :displayed="rowCount" @v-scroll="vScroll">
      <div class="tbl grid" ref="grid" @keydown="onKeydown" @wheel="onWheel" @click="onClick">
        <div class="tbl-row">
          <div class="tbl-cell col-head" v-for="(requisite, key) in requisites" :key="key" :style="{'width':width(requisite)+'px'}">
            <grid-column-head
              :requisite="requisite"
              :keyField="key"
              :sort="sort"
              @order-by="orderBy"
            />
          </div>
          <div class="tbl-cell"></div>
        </div>
        <div class="tbl-body" ref="tBody">
          <div class="tbl-row row" v-for="(row, rowIdx ) in dislpayRows">
            <div class="tbl-cell cell" v-for="(req, index) in cols" :style="{'width':width(req)+'px'}">
              <field-grid-requisite
                :requisite="req"
                :value="index=='nstr' ? idx+rowIdx+1 : row[index]"
              />
            </div>
            <div class="tbl-cell ended"></div>
          </div>
        </div>
      </div>
    </scroll-wrap>
    </div>
  </div>
</template>

<script>
import common from '../../common.js'

export default {
  name: 'field-grid',
  props: {
    endpoint: { type: Object },
    detailName: { type: String },
    requisites: { type: Object }
  },
  data () {
    return {
      cols: this.requisites,

      gridWrapHeight: 0,
      gridWrapWidth: 0,

      headHeight: 0,
      rowHeight: 0,
      footHeight: 0,

      rowCount: 6,
      idx: 0,
      
      currentCell: undefined,
      sort: ''
    }
  },
  computed: {
    rowIndex () {
      return this.currentRow !== undefined ? Array.prototype.indexOf.call(this.currentRow.parentNode.children, this.currentRow) : undefined
    },  
    currentRow () {
      return this.currentCell !== undefined ? this.currentCell.parentNode.parentNode : undefined
    },
    absIndex () {
      return this.idx + this.rowIndex
    },
    rows () {
      return this.$store.getters.getRequisiteValue(this.endpoint.key, this.detailName) || undefined
    },
    dislpayRows () {
      return this.rows !== undefined ? this.rows.slice(this.idx, (this.rowCount === 0 ? 1 : this.rowCount) + this.idx) : undefined
    },
    k () {
      return this.rows !== undefined ? this.rowCount / (this.rows.length ) : undefined
    },
    prevCell () { 
      if (this.currentCell === undefined) {
        return undefined
      }
      if (this.currentRow.previousElementSibling !== null) {
        let index = Array.prototype.indexOf.call(this.currentRow.children, this.currentCell.parentNode)
        return this.currentRow.previousElementSibling.childNodes[index].childNodes[0]
      } else {
        return null
      } 
    },
    nextCell () { 
      if (this.currentCell === undefined) {
        return undefined
      }
      if (this.currentRow.nextElementSibling !== null) {
        let index = Array.prototype.indexOf.call(this.currentRow.children, this.currentCell.parentNode)
        return this.currentRow.nextElementSibling.childNodes[index].childNodes[0]
      } else {
        return null
      } 
    }
  },
  methods: {
    add () {
      let blank = common.getBlankObject(this.requisites)
      let i
      for (i = 0; i < 10000; i++)
      this.$store.commit('addRow', { key: this.endpoint.key, detail: this.detailName, blank: blank })
    },
    edit () {
    },
    remove () {
      this.currentCell.focus()
      this.$store.commit('delRow', { key: this.endpoint.key, detail: this.detailName, index: this.absIndex })
      if (this.idx-1 + this.rowCount === this.rows.length) {
        this.idx--
      }
      
    },
    rowUp () {
      if (this.prevCell !== undefined  && this.prevCell !== null) {
        this.$store.commit('localMove', { key: this.endpoint.key, detail: this.detailName, index: this.absIndex, direction: 'up' })
        this.currentCell = this.prevCell
        this.currentCell.focus()
      }
    },
    rowDown () {
      if (this.nextCell !== undefined && this.nextCell !== null) {
        this.$store.commit('localMove', { key: this.endpoint.key, detail: this.detailName, index: this.absIndex, direction: 'down' })
        this.currentCell = this.nextCell
        this.currentCell.focus()   
      }  
    },
    orderBy (key) {
      if (key === this.sort) {
        this.sort = '-' + this.sort
        var reverse = true
      } else {
        this.sort = key
        reverse = false
      }
      this.$store.commit('localSort', { key: this.endpoint.key, detail: this.detailName, requisite: key, reverse: reverse })
    },
    width (requisite) {
      return common.getDefaultColWidth(requisite)
    },
    vScroll (p1, p2) {
      this.idx = Math.ceil(p1 / (p2 / ((this.rows.length -1) - (this.rowCount-1))))      
    },
    pgUp () {
      this.idx = (this.idx - this.rowCount >= 0) ? this.idx - this.rowCount : 0
    },
    pgDown () {
      this.idx = (this.idx + this.rowCount <= this.rows.length - this.rowCount) ? this.idx + this.rowCount : Math.max(this.rows.length - this.rowCount, this.idx)
    },
    end (el) {
      this.idx = Math.max(this.rows.length - this.rowCount, this.idx)
      let index = Array.prototype.indexOf.call(el.parentNode.parentNode.children, el.parentNode)
      this.currentCell = this.$refs.tBody.childNodes[Math.min(this.rowCount - 3, this.rows.length - 1)].childNodes[index].firstChild
      this.currentCell.focus()
    },
    home (el) {
      this.idx = 0
      let index = Array.prototype.indexOf.call(el.parentNode.parentNode.children, el.parentNode)
      this.currentCell = this.$refs.tBody.childNodes[0].childNodes[index].firstChild
      this.currentCell.focus()
    },
    left (el) {
      if (el.parentNode.previousElementSibling !== null) {
        let delta = el.parentNode.previousElementSibling.getBoundingClientRect().left - this.$refs.grid.parentNode.getBoundingClientRect().left
        if (delta < 0) {
          this.$refs.grid.parentNode.scrollLeft -= Math.abs(delta)
        }
        el.parentNode.previousElementSibling.childNodes[0].focus()
      }
    },
    right (el) {
      if (el.parentNode.nextElementSibling !== null && el.parentNode.nextElementSibling.classList.contains('cell')) {
        let delta = this.$refs.grid.parentNode.getBoundingClientRect().right - el.parentNode.nextElementSibling.getBoundingClientRect().right
        if (delta < 0) {
          this.$refs.grid.parentNode.scrollLeft += Math.abs(delta)
        }
        el.parentNode.nextElementSibling.childNodes[0].focus()
      }
    },
    up (el) {
      var row = el.parentNode.parentNode
      if (row.previousElementSibling !== null) {
        let index = Array.prototype.indexOf.call(row.children, el.parentNode)
        row.previousElementSibling.childNodes[index].childNodes[0].focus()
        this.currentCell = row.previousElementSibling.childNodes[index].childNodes[0]
      } else {
        this.idx = this.idx > 0 ? this.idx - 1 : 0
      }
    },
    down (el) {
      var row = el.parentNode.parentNode
      if (row.nextElementSibling !== null) {
        let index = Array.prototype.indexOf.call(row.children, el.parentNode)
        row.nextElementSibling.childNodes[index].childNodes[0].focus()
        this.currentCell = row.nextElementSibling.childNodes[index].childNodes[0]
      } else if (this.rows.length > this.rowCount) {
        this.idx = (this.idx < this.rows.length - this.rowCount) ? this.idx + 1 : this.rows.length - this.rowCount
      }
    },
    tab (el) {
      var row = el.parentNode.parentNode
      if (el.parentNode.nextElementSibling !== null && el.parentNode.nextElementSibling.classList.contains('cell')) {
        el.parentNode.nextElementSibling.childNodes[0].focus()
      } else if (row.nextElementSibling !== null) {
        row.nextElementSibling.firstChild.childNodes[0].focus()
      } else if (this.idx + this.rowCount < this.rows.length) {
        this.idx++
        row.firstChild.childNodes[0].focus()
      }
    },
    onKeydown (e) {
      switch (e.keyCode) {
        case 9:  //tab
          e.preventDefault()
          this.tab(e.target);
        break;
        case 33:// PgUp
          this.pgUp(e.target)
          break
        case 34:// PgDown
          this.pgDown(e.target)
          break
        case 35:// end
          this.end(e.target)
          break
        case 36:// home
          this.home(e.target)
          break
        case 37:// left
          this.left(e.target)
          break
        case 38:// up
          this.up(e.target)
          break
        case 39:// right
          this.right(e.target)
          break
        case 40:// down
          this.down(e.target)
          break
        case 46:// delete
          this.remove()
          break  
      }
    },
    onClick (e) {
      let el = e.target
      let rDelta = this.$refs.grid.parentNode.getBoundingClientRect().right - el.parentNode.getBoundingClientRect().right
      let lDelta = el.parentNode.getBoundingClientRect().left - this.$refs.grid.parentNode.getBoundingClientRect().left
      if (rDelta < 0) {
        this.$refs.grid.parentNode.scrollLeft += Math.abs(rDelta)
      } else if (lDelta < 0) {
        this.$refs.grid.parentNode.scrollLeft -= Math.abs(lDelta)
      }
      this.currentCell = e.target
    },
    onWheel (e) {
      var y = e.deltaY / 20
      if (y > 0 && this.idx + this.rowCount < this.rows.length) {
        this.idx++
      } else if (this.idx > 0) this.idx--
    }
  }
}
</script>

<style scoped>
.grid-wrap {
  padding: 10px 5px 5px 5px;
}
.tbl {
  display: table;
}
.tbl-row {
  display: table-row;
}
.tbl-cell {
  display: table-cell;
}
.tbl-body {
  display: table-row-group;
}

.grid {
  width: 100%;
  font: 9pt verdana;
  border-collapse: collapse;
  cursor: default;
}

.col-head {
  /*padding: 1px; */
  font-weight: normal;
  border-right: 1px solid lightGray;
  border-bottom: 1px solid lightGray;
}

.d-cell {
  /*-moz-user-select: none;
  -khtml-user-select: none;*/
  border: 0px solid whiteSmoke;
  padding: 6px;
  margin: 1px 0px 0px 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 100%;
}

.row:nth-child(odd) {
  background-color: white;
  border-bottom: 1px solid lightGray;
}
.row:nth-child(even) {
  background-color: #f9f9f9;
  border-bottom: 1px solid lightGray;
}
.row:last-child {
  border-bottom: 0px solid lightGray;
}
.cell:nth-last-child(2) {
  border-right: 1px solid lightGray;
}

.ended  {
  display: none;
}
</style>
