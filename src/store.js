import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import user from './store/user.js'
import metadata from './store/metadata.js'
import common from './store/common.js'
import other from './store/other.js'

Vue.use(Vuex)

import VueSession from 'vue-session'
Vue.use(VueSession)

export default new Vuex.Store({
  modules: {
    user, 
    metadata,
    common,
    other
  }
})