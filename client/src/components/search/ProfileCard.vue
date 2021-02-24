<template>
  <q-card class="row" square flat bordered>
    <q-card-section class="col-sm-1 col-xs-2">
      <q-avatar v-if="profile.useGravatar">
        <img :src="JSON.parse(profile.gravatar).large" />
      </q-avatar>
      <q-avatar v-else>
        <img :src="JSON.parse(profile.image).large" />
      </q-avatar>
    </q-card-section>
    <q-card-section class="col-sm-11 col-xs-10">
      <div>{{ this.profile.displayFullName }}</div>
      <div class="q-mt-xs" style="color: gray">Institution placeholder</div>
      <div class="q-mt-xs" v-if="profile.bio !== null">{{ profile.bio }}</div>
    </q-card-section>
  </q-card>
</template>
<script>
import _ from 'lodash'

export default {
  name: 'ProfileCard',
  props: ['search', 'profile']
}
</script>
