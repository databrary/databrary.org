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
        <div class="text-h6 col-12">
        <hr />
          <!-- <div class="text-h6 col-12">
            Databrary
          </div>
          <div class="text-subtitle1 col-12">
            123 abc Street, Room 456 | some city, <br />NY 1234 567.789.1011
          </div> -->
          <div class="text-center text-subtitle1 col-12">
            Copyright &copy;2014-{{year}} Databrary
          </div>
        </div>
      </div>
    </q-toolbar>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
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
  methods: {
    openURL,
    toggleDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  },
  created () {
    this.year = (new Date()).getFullYear()
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
