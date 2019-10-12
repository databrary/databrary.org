<template>
  <div>
    <LandingLoggedIn v-if="isLoggedIn" />
    <LandingLoggedOut v-else/>
  </div>
</template>

<script>
import LandingLoggedIn from './LandingLoggedIn.vue'
import LandingLoggedOut from './LandingLoggedOut.vue'

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
