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
import NavBar from '../components/layout/NavBar'

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
  async mounted () {
    await this.fetchData()
  },
  watch: {
    $route: 'fetchData'
  },
  computed: {
    isBackendDisconnected: sync('app/isBackendDisconnected')
  },
  async created () {
    this.year = (new Date()).getFullYear()
  },
  methods: {
    openURL,
    async fetchData () {
      const { status } = await this.$axios.get('/healthz')
      console.log(status)
      if (status !== 200) {
        this.isBackendDisconnected = true
      } else {
        this.isBackendDisconnected = false
      }
    },
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
