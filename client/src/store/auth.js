export default {
  namespaced: true,
  state: {
    isLoggedIn: null
  },
  getters: {
    isLoggedIn: state => {
      return state.isLoggedIn
    }
  },
  mutations: {
    logIn: state => {
      state.isLoggedIn = true
    },
    logOut: state => {
      state.isLoggedIn = false
    }
  },
  actions: {
    // checkLoggedIn: ({ commit }) => {
    //   return new Promise((resolve, reject) => {
    //     console.log(response)
    //     commit('logIn')
    //     resolve(response)
    //   })
    // }
  }
}
