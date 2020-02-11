<template>
  <div>
    <LandingLoggedIn v-if="isLoggedIn" />
    <LandingLoggedOut v-else/>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'

import LandingLoggedIn from './Landing/LandingLoggedIn.vue'
import LandingLoggedOut from './Landing/LandingLoggedOut.vue'

export default {
  name: 'LandingPage',
  components: {
    LandingLoggedIn,
    LandingLoggedOut
  },
  computed: {
    isLoggedIn: get('app/isLoggedIn')
  }
}
</script>
