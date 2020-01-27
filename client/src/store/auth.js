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
          try {
            const response = await axios({ url: 'http://localhost:8000/session', method: 'GET' })
            console.log(`Response loadsession ${response.data}`)
            if (response.data.sessionID) {
              commit('logIn')
              commit('setUserId', response.data.dbId)
              commit('setSessionId', response.data.sessionID)
            } else {
              commit('logOut')
              commit('setUserId', null)
              commit('setSessionId', null)
            }
            resolve(true)
          } catch (error) {
            // Error 😨
            if (error.response) {
              /*
               * The request was made and the server responded with a
               * status code that falls out of the range of 2xx
               */
              console.log(error.response.data)
              console.log(error.response.status)
              console.log(error.response.headers)
            } else if (error.request) {
              /*
               * The request was made but no response was received, `error.request`
               * is an instance of XMLHttpRequest in the browser and an instance
               * of http.ClientRequest in Node.js
               */

              console.log(error.request)
            } else {
              // Something happened in setting up the request and triggered an Error
              console.log('Error', error.message)
            }
            console.log(error)
          }
        }
      })
    }
  }
}
