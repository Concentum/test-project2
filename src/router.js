import Vue from 'vue'
import Router from 'vue-router'
import win from './components/win.vue'

import md from './metadata.json'

Vue.use(Router)

function flat (arr) {
  var result = []
  for (var i = 0; i <= arr.length - 1; i++) {
    if (arr[i].items !== undefined) {
      result.concat(flat(arr[i].items))
    } else {
      result.push({ 'path': arr[i].endpoint.replace(/\./g, '/'), 'name': arr[i].endpoint, win })
    }
  }
  return result
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: flat(md.interfaces.main.menu)
})
