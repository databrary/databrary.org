import Vue from 'vue'
import Vuex from 'vuex'

import pathify from './pathify'

import app from './app'
// import auth from './auth'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    plugins: [ pathify.plugin ],

    modules: {
      app
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })
  return Store
}
