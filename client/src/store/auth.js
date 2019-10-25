import axios from 'axios'

export default {
  namespaced: true,
  state: {
    isLoggedIn: null,
    sessionId: null,
    userId: null
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    sessionId: state => state.sessionId,
    userId: state => state.userId
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
    },
    setUserId: (state, id) => {
      state.userId = id
    }
  },
  actions: {
    loadSession: ({ getters, commit }) => {
      return new Promise(async (resolve, reject) => {
        if (getters.isLoggedIn === null) {
          const response = await axios({ url: 'http://localhost:8000/session', method: 'GET' })
          if (response.data.passport) {
            commit('logIn')
            commit('setUserId', response.data.dbId)
            commit('setSessionId', response.data.sessionID)
          } else {
            commit('logOut')
            commit('setUserId', null)
            commit('setSessionId', null)
          }
        }
        resolve(true)
      })
    }
  }
}
