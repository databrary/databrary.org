<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  created () {
    if (this.$store.getters['auth/isLoggedIn'] === null) {
      axios({ url: 'http://localhost:8000/session', method: 'GET' }).then((response) => {
        if (response.data.passport) {
          this.$q.localStorage.set('isLoggedIn', true)
          this.$store.commit('auth/logIn')
        } else {
          this.$q.localStorage.set('isLoggedIn', false)
          this.$store.commit('auth/logOut')
        }
      })
    }
  }
}
</script>

<style>
</style>
