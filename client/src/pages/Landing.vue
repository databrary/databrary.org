<template>
  <q-page>
    <LoggedIn v-if="isLoggedIn" />
    <LoggedOut v-else/>
  </q-page>
</template>

<script>
import { get } from 'vuex-pathify'

import LoggedIn from '@/components/landing/LoggedIn'
import LoggedOut from '@/components/landing/LoggedOut'

export default {
  name: 'LandingPage',
  components: {
    LoggedIn,
    LoggedOut
  },
  computed: {
    isLoggedIn: get('app/isLoggedIn')
  }
}
</script>
