<template>
  <q-layout  view="hHh lpr fFf">

    <q-header style="min-width:320px" reveal bordered>
      <NavBar />
    </q-header>

    <q-page-container>
      <q-banner
        v-if="isBackendDisconnected"
        inline-actions
        class="text-white bg-red"
      >
        Disconnected from the backend. Start the server or change the port.
      </q-banner>
      <router-view />
    </q-page-container>

    <q-toolbar
      bordered
      class="text-black"
    >
      <div class="row full-width">
        <div class="col-12 text-h6 text-center text-subtitle1">
          <small>Copyright &copy;2014-{{year}} Databrary</small>
        </div>
      </div>
    </q-toolbar>
  </q-layout>
</template>

<script>
import { sync } from 'vuex-pathify'
import { openURL } from 'quasar'
import NavBar from '@/components/layout/NavBar'

export default {
  name: 'MyLayout',
  components: {
    NavBar
  },
  data () {
    return {
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
    }
  }
}
</script>
