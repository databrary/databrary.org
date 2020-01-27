<template>
  <div>
    <LandingLoggedIn v-if="isLoggedIn" />
    <LandingLoggedOut v-else />
  </div>
</template>

<script>
import LandingLoggedIn from './Landing/LandingLoggedIn.vue'
import LandingLoggedOut from './Landing/LandingLoggedOut.vue'

export default {
  name: 'LandingPage',
  components: {
    LandingLoggedIn,
    LandingLoggedOut
  },
  computed: {
    isLoggedIn () { return this.$store.getters['auth/isLoggedIn'] }
  }
}
</script>
