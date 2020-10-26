import Vue from 'vue'
import { make } from 'vuex-pathify'
import _ from 'lodash'

const state = {
  lists: [
    {
      name: 'Favorites',
      children: [
      ]
    },
    {
      name: 'Manuscript 1',
      children: [
      ]
    }
  ]
}

const getters = {
  ...make.getters(state)
}

const mutations = {
  ...make.mutations(state),
  addToList (state, { listName, item }) {
    const listIndex = _.findIndex(state.lists, { name: listName })
    Vue.set(state.lists, listIndex, {
      name: state.lists[listIndex].name,
      children: [...state.lists[listIndex].children, { name: item }]
    })
  }
}

const actions = {
  ...make.actions(state),
  addToList ({ commit }, payload) {
    commit('addToList', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
