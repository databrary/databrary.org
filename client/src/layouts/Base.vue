<template>
  <q-layout  view="hHh lpr fFf">
    <q-header style="min-width:320px" reveal bordered>
      <NavBar @toggleDrawer="toggleDrawer"/>
    </q-header>

    <q-page-container>
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
      year: null
    }
  },
  computed: {
    isLoggedIn: sync('app/isLoggedIn'),
    userId: sync('app/dbId'),
    sessionId: sync('app/sessionId')
  },
  async created () {
    this.year = (new Date()).getFullYear()
    await this.fetchData()
  },
  watch: {
    $route: 'fetchData'
  },
  methods: {
    async fetchData () {
      if (this.isLoggedIn === null) {
        const response = await axios({ url: 'http://localhost:8000/session', method: 'GET' })
        if (response.data.sessionID) {
          this.isLoggedIn = true
          this.userId = response.data.dbId
          this.sessionId = response.data.sessionID
        } else {
          this.isLoggedIn = false
          this.userId = null
          this.sessionId = null
          openURL('http://localhost:8000/login')
        }
      } else if (this.isLoggedIn === false) {
        openURL('http://localhost:8000/login')
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
