<template>
    <q-card class="col" square flat bordered>                                                                                                                                                                                                                                                  <q-card-section horizontal>
            <q-card-section class="col-sm-1 col-xs-2">
                <q-avatar v-if="profile.useGravatar">
                    <img :src="profile.gravatar.large">
                </q-avatar>
                <q-avatar v-else>
                    <img :src="profile.image.large">
                </q-avatar>
            </q-card-section>
            <q-card-section class="col-sm-11 col-xs-10">
                <div>{{ this.profile.displayFullName }}</div>
                <div class="q-mt-xs" style="color: gray">Institution placeholder</div>
                <div class="q-mt-xs" v-if="profile.bio !== null">{{ profile.bio }}</div>
            </q-card-section>
        </q-card-section>
    </q-card>
</template>
<script>
import _ from 'lodash'

export default {
  name: 'ProfileCard',
  props: [ 'search', 'profile' ],
  computed: {
    fullName: function () {
      if (!this.profile.displayFullName.toLowerCase().includes(this.search.toLowerCase())) {
        const fullName = `${this.profile.givenName} ${this.profile.familyName}${this.profile.additionalName ? `. ${this.profile.additionalName}.` : ''}`
        return _.startCase(fullName)
      }
      return _.startCase(this.profile.displayFullName)
    }
  }
}
</script>
