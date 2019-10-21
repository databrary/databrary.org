import axios from 'axios'

export default {
  namespaced: true,
  state: {
    isLoggedIn: null,
    sessionId: null
  },
  getters: {
    isLoggedIn: state => {
      return state.isLoggedIn
    },
    sessionId: state => {
      return state.sessionId
    }
  },
  mutations: {
    logIn: state => {
      state.isLoggedIn = true
    },
    logOut: state => {
      state.isLoggedIn = false
    },
    setSessionId: (state, id) => {
      state.sessionId = id
    }
  },
  actions: {
    loadSession: ({ getters, commit }) => {
      return new Promise(async (resolve, reject) => {
        if (getters.isLoggedIn === null) {
          const response = await axios({ url: 'http://localhost:8000/session', method: 'GET' })
          if (response.data.passport) {
            commit('logIn')
            commit('setSessionId', response.data.sessionID)
          } else {
            commit('logOut')
          }
        }
        resolve(true)
      })
    }
  }
}
