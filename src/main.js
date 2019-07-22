import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import _ from 'lodash'
// import axios from 'axios'
// import moment from 'moment'

import mainMenu from './components/main-menu'
import tray from './components/tray'
import win from './components/win'
import listBuilder from './components/list-builder'
import formBuilder from './components/form-builder'
import filterBuilder from './components/filter-builder'

import toolPanel from './components/common/tool-panel'
import searchPanel from './components/common/search-panel'
import modal from './components/common/modal'
import paginator from './components/common/paginator'
import gridColumnHead from './components/common/grid-column-head'
import grid from './components/common/grid'
import filterCondition from './components/common/filter-condition'
import fieldGridRequisite from './components/common/field-grid-requisite'
import scrollWrap from './components/common/scroll-wrap'
import fieldGridToolPanel from './components/common/field-grid-tool-panel'

import formField from './components/form-field'

import fieldBoolean from './components/fields/field-boolean'
import fieldEnum from './components/fields/field-enum'
import fieldString from './components/fields/field-string'
import fieldDate from './components/fields/field-date'
import fieldNumber from './components/fields/field-number'
import fieldObject from './components/fields/field-object'
import fieldGrid from './components/fields/field-grid'


window.moment = require('moment')

window.axios = require('axios')

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

Vue.config.productionTip = false

Vue.component('main-menu', mainMenu)
Vue.component('tray', tray)
Vue.component('win', win)
Vue.component('list-builder', listBuilder)
Vue.component('form-builder', formBuilder)
Vue.component('filter-builder', filterBuilder)
Vue.component('tool-panel', toolPanel)
Vue.component('search-panel', searchPanel)
Vue.component('grid-column-head', gridColumnHead)
Vue.component('grid', grid)
Vue.component('modal', modal)
Vue.component('paginator', paginator)
Vue.component('form-field', formField)
Vue.component('filter-condition', filterCondition)

Vue.component('scroll-wrap', scrollWrap)
Vue.component('field-grid-tool-panel', fieldGridToolPanel)

Vue.component('field-enum', fieldEnum)
Vue.component('field-boolean', fieldBoolean)
Vue.component('field-string', fieldString)
Vue.component('field-date', fieldDate)
Vue.component('field-number', fieldNumber)
Vue.component('field-object', fieldObject)
Vue.component('field-grid', fieldGrid)
Vue.component('field-grid-requisite', fieldGridRequisite)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
