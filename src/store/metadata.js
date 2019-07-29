import axios from 'axios'

const url = 'http://127.0.0.1:8081/index-test.php/'

export default {
  state: {
    metadata: null
  },
  mutations: {
    setMetadata (state, payload) {
      state.metadata = payload
    }
  },
  actions: {
    getMetadata ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      axios.get(url + 'metadata')
      .then(response => {
        commit('setLoading', false)
        commit('setMetadata', response.data)
      })  
      .catch(error => {
        commit('setLoading', false)
        commit('setError', error.message)
      }) 
    }
  },
  getters: {
    metadata (state) {
      return state.metadata
    }
  },
}   