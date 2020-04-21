import { make } from 'vuex-pathify'
import axios from 'axios'
import _ from 'lodash'

const state = {
  isLoggedIn: false,
  dbId: null,
  authServerId: null,
  emailPrimary: null,
  thumbnail: null,
  avatar: null,
  displayFullName: null,
  isBackendDisconnected: false,
  useGravatar: null,
  avatarURL: null,
  gravatarURL: null,
  version: 1
}

const getters = {
  ...make.getters(state)
}

const mutations = {
  ...make.mutations(state)
}

const actions = {
  ...make.actions(state),

  async syncSessionAsync ({ commit }) {
    const response = await axios({ url: '/session', method: 'GET' })
    console.log(`Session response`, JSON.stringify(response.data))
    if (_.get(response.data, 'dbId') !== undefined) {
      commit('isLoggedIn', true)
      commit('dbId', response.data.dbId)
      commit('useGravatar', response.data.useGravatar === true)
      commit('avatar', response.data.useGravatar === true
        ? response.data.gravatarURL.large : response.data.avatarURL.large)
      commit('thumbnail', response.data.useGravatar === true
        ? response.data.gravatarURL.thumbnail : response.data.avatarURL.thumbnail)
      commit('gravatarURL', response.data.gravatarURL)
      commit('avatarURL', response.data.avatarURL)
    } else {
      commit('isLoggedIn', false)
      commit('dbId', null)
      commit('useGravatar', false)
      commit('large', null)
      commit('thumbnail', null)
      commit('gravatarURL', null)
      commit('avatarURL', null)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
