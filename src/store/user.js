import axios from 'axios'

class User {
  constructor (p) {
    this.id = p.user_id
    this.username = p.username
    this.email = p.email
    this.token = p.token
    this.expired_at = p.expired
  }
}

const url = 'http://127.0.0.1:8081/index-test.php/'

export default {
  state: {
    user: null
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
    logout ({commit}) {
      commit('setUser', null)
    },
    autoLogin ({commit}, payload) {
      commit('setUser', payload)
    },
    async ragisterUser ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const response = await axios.post(url + 'signup', payload)
        commit('setUser', new User(response.data))
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      } 
    },
    async loginUser ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const response = await axios.post(url + 'auth', payload)
        commit('setUser', new User(response.data))
        commit('setLoading', false)
      } catch (error) {
        console.log(error.message)
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      } 
    }
  },
  getters: {
    user (state) {
      return state.user
    }
  },
}   