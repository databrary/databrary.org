import axios from 'axios'
import network from '../utils/network'

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
          console.log(`Quasar Loading session`)
          const server_ip = await network.getServerAddressAsync()
          console.log(`Server IP address is ${server_ip} PORT ${process.env.BASE_PORT}`)
          const response = await axios({ url: `http://${server_ip}:${process.env.BASE_PORT}/session`, method: 'GET' })
          if (response.data.sessionID) {
            console.log(`Logged In: Found session ID ${response.data.sessionID} user ID ${response.data.dbId}`)
            commit('logIn')
            commit('setUserId', response.data.dbId)
            commit('setSessionId', response.data.sessionID)
          } else {
            console.log(`Logged Out: Cannot find a session`)
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
