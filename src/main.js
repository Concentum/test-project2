import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import _ from 'lodash'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context('./components', true, /\.vue$/)

import login from './views/auth/login'

Vue.config.productionTip = false

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = upperFirst(
    camelCase(
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})

Vue.component('login', login) 

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
