<template>
  <q-layout  view="hHh lpr fFf">

    <q-header style="min-width:320px" reveal bordered>
      <NavBar @toggleDrawer="toggleDrawer"/>
    </q-header>

    <q-page-container>
      <q-banner v-if="isBackendDisconnected" inline-actions class="text-white bg-red">
        Disconnected from the backend. Start the server or change the port.
    </q-banner>
      <router-view />
    </q-page-container>

    <q-toolbar bordered class="databrary-footer max-page-width bg-white text-black">
      <div class="row full-width">
        <hr />
        <div class="text-h6 col-12">
          <div class="text-center text-subtitle1 col-12">
            Copyright &copy;2014-{{year}} Databrary
          </div>
        </div>
      </div>
    </q-toolbar>
  </q-layout>
</template>

<script>
import { sync } from 'vuex-pathify'
import { openURL } from 'quasar'
import _ from 'lodash'
import axios from 'axios'
import NavBar from '../components/Layout/NavBar.vue'

export default {
  name: 'MyLayout',
  components: {
    NavBar
  },
  data () {
    return {
      leftDrawerOpen: false, // this.$q.platform.is.desktop,
      year: null,
      isBackendDisconnected: false
    }
  },
  computed: {
    isLoggedIn: sync('app/isLoggedIn'),
    userId: sync('app/dbId'),
    sessionId: sync('app/sessionId')
  },
  async created () {
    this.year = (new Date()).getFullYear()
    await this.syncSessionAndStore()
  },
  watch: {
    $route: 'syncSessionAndStore'
  },
  methods: {
    async syncSessionAndStore () {
      console.log('this.isLoggedIn', this.isLoggedIn, this.userId, this.sessionId)
      if (
        this.isLoggedIn === null ||
        (this.isLoggedIn === true && this.userId === null)
      ) {
        try {
          const response = await axios({ url: '/session', method: 'GET' })
          if (_.get(response.data.key, 'dbId') !== undefined) {
            console.log(`Session repsonse`, response.data, response.data.dbId)
            this.isLoggedIn = true
            this.userId = response.data.key.dbId
            this.sessionId = response.data.sessionID
          } else {
            this.isLoggedIn = false
            this.userId = null
            this.sessionId = null
          }
        } catch (error) { // TODO specify the error
          this.isBackendDisconnected = true
        }
      } else if (this.isLoggedIn === false) {
        this.userId = null
        this.sessionId = null
      }
    },
    openURL,
    toggleDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  }
}
</script>

<style>
.q-layout__section--marginal {
  background-color:#e0e0e0;
}
.databrary-footer {
  width: 100%;
}

.max-page-width {
  max-width: 1200px !important;
  margin: auto;
}
</style>
