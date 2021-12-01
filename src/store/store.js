import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sessionKey: window.localStorage.getItem('sessionKey')
  },
  mutations: {
    login (state, sessionKey) {
      state.sessionKey = sessionKey;
    }
  },
  actions: {
    login ({ commit }, sessionKey) {
      commit('logon', sessionKey)
    }
  },
  modules: {
  }
})
