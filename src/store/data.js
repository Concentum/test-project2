import axios from 'axios'
import Vue from 'vue'

const url = 'http://127.0.0.1:8081/index-test.php/'

export default {
  state: {
    wins: [],
    currentWin: undefined,
    data: {},
    sort: {},
    filter: []
  },
  getters: {
    getFilter: state => key => {
      return state.filter[key]
    },
    getSort: state => key => {
      return state.sort[key]
    },
    getData: state => key => {
      return state.data[key]
    },
    getDataRows: state => key => {
      if (state.data[key] !== undefined) {
        return state.data[key].items
      }
    },
    getPageCount: state => key => {
      if (state.data[key] !== undefined) {
        return state.data[key]._meta.pageCount
      }
    },
    getCurrentPage: state => key => {
      if (state.data[key] !== undefined) {
        return state.data[key]._meta.currentPage
      }
    },
    wins: state => {
      return state.wins
    },
    currentWin: state => {
      return state.currentWin
    },
    getRequisiteValue: state => (key, req) => {
      if (state.data[key] !== undefined) {
        if (state.data[key][req] !== undefined) {
          return state.data[key][req]
        }
      }
    }
  },

  mutations: {
    setFilter (state, pl) {
      if (state.filter[pl.key] !== pl.requisites) {
        Vue.set(state.filter, pl.key, pl.requisites)
      }
    },
    localSort (state, pl) {
      state.data[pl.key][pl.detail].sort(
        (a, b) => {
          var _a = typeof a[pl.requisite] === 'object' ? a[pl.requisite].description : (!isNaN(+a[pl.requisite]) ? +a[pl.requisite] : a[pl.requisite])
          var _b = typeof b[pl.requisite] === 'object' ? b[pl.requisite].description : (!isNaN(+b[pl.requisite]) ? +b[pl.requisite] : b[pl.requisite])
          if (_a === _b) return 0
          return pl.reverse ? ((_a < _b) ? -1 : 1) : ((_a < _b) ? 1 : -1)
        })
    },
    localMove (state, pl) {
      var tmp1 = state.data[pl.key][pl.detail][pl.index]
      if (pl.direction === 'up' && pl.index > 0) {
        let tmp = state.data[pl.key][pl.detail][pl.index - 1]
        Vue.set(state.data[pl.key][pl.detail], pl.index - 1, tmp1)
        Vue.set(state.data[pl.key][pl.detail], pl.index, tmp)
      } else if (pl.direction === 'down' && pl.index < state.data[pl.key][pl.detail].length) {
        let tmp = state.data[pl.key][pl.detail][pl.index + 1]
        Vue.set(state.data[pl.key][pl.detail], pl.index + 1, tmp1)
        Vue.set(state.data[pl.key][pl.detail], pl.index, tmp)
      }
    },
    addRow (state, pl) {
      state.data[pl.key][pl.detail].push(pl.blank)
    },
    delRow (state, pl) {
      Vue.delete(state.data[pl.key][pl.detail], pl.index)
    },
    setSort (state, pl) {
      if (state.sort[pl.key] !== pl.requisite) {
        Vue.set(state.sort, pl.key, pl.requisite)
      } else {
        Vue.set(state.sort, pl.key, '-' + pl.requisite)
      }
    },
    setRequisiteValue (state, pl) {
      Vue.set(state.data[pl.key], pl.requisite, pl.value)
    },
    setCurrentWin (state, item) {
      state.currentWin = item
    },
    addWin (state, item) {
      item.key = new Date().getTime()
      state.wins.push(item)
    },
    delWin (state, item) {
      let i = state.wins.length - 1
      while (i >= 0) {
        if (state.wins[i].key === item.key || state.wins[i].parentKey === item.key) {
          Vue.delete(state.data, state.wins[i].key)
          Vue.delete(state.sort, state.wins[i].key)
          Vue.delete(state.filter, state.wins[i].key)
          state.wins.splice(i, 1)
          state.currentWin = state.wins[i] !== undefined ? state.wins[i] : state.wins[state.wins.length - 1]
        }
        i--
      }
    },
    setData (state, pl) {
      Vue.set(state.data, pl.key, pl.data)
    }
  },

  actions: {
    filter (context, pl) {
      context.commit('setFilter', pl)
    },
    sort (context, pl) {
      context.commit('setSort', pl)
    },
    openWin (context, item) {
      let find
      if (item.parentKey === undefined) {
        find = context.state.wins.find((e) => {
          return e.endpoint === item.endpoint
        })
      } else {
        find = context.state.wins.find((e) => {
          return e.endpoint === item.endpoint && e.parentKey === item.parentKey
        })
      }
      if (find === undefined) {
        context.commit('addWin', item)
        context.commit('setCurrentWin', item)
      } else {
        context.commit('setCurrentWin', find)
      }
    },
    closeWin (context, item) {
      context.commit('delWin', item)
      if (item.parentKey !== undefined) { // если окно - для выбора, то назначить текущим - родительское окно
        var find = context.state.wins.find((e) => {
          return e.key === item.parentKey
        })
        if (find !== undefined) {
          context.commit('setCurrentWin', find)
        }
      }
    },
    fetch (context, pl) {
      pl.options.headers = {'Authorization': 'Bearer ' + this.getters.user.token}
      axios.get(url + pl.endpoint, pl.options).then((response) => {
        context.commit('setData', { key: pl.key, data: response.data })
      }).catch(e => {
        console.log('error!')
      })
    },
    search (context, pl) {
      pl.options.headers = {'Authorization': 'Bearer ' + this.getters.user.token}
      return axios.get(url + pl.endpoint, pl.options).then(response => {
          return response
      }).catch(e => {
        console.log('error!')
      })
    },
  }
}
