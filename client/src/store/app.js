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
  updateAvatar ({ commit, getters }, isGravatar) {
    if (isGravatar) {
      commit('avatar', getters.gravatarURL.large)
      commit('thumbnail', getters.gravatarURL.thumbnail)
    } else {
      commit('avatar', getters.avatarURL.large)
      commit('thumbnail', getters.avatarURL.thumbnail)
    }
  },
  async syncSessionAsync ({ commit }) {
    const { data } = await axios({ url: '/session', method: 'GET' })
    if (_.get(data, 'dbId')) {
      console.log(`Session response`, JSON.stringify(data))
      commit('isLoggedIn', true)
      commit('dbId', data.dbId)
      commit('useGravatar', data.useGravatar === true)
      commit('avatar', data.useGravatar === true
        ? data.gravatarURL.large : data.avatarURL.large)
      commit('thumbnail', data.useGravatar === true
        ? data.gravatarURL.thumbnail : data.avatarURL.thumbnail)
      commit('avatarURL', data.avatarURL)
      commit('gravatarURL', data.gravatarURL)
    } else {
      commit('isLoggedIn', false)
      commit('dbId', null)
      commit('useGravatar', false)
      commit('avatar', null)
      commit('thumbnail', null)
      commit('avatarURL', null)
      commit('gravatarURL', null)
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
