<template>
    <q-card class="col" square flat bordered>
        <q-item>
            <q-item-section avatar>
                <q-avatar v-if="profile.useGravatar">
                    <img :src="profile.gravatar.large">
                </q-avatar>
                <q-avatar v-else>
                    <img :src="profile.image.large">
                </q-avatar>
            </q-item-section>

            <q-item-section>
                <q-item-label>{{ fullName }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-separator />

        <q-card-section v-if="profile.bio !== null" horizontal>
            <q-card-section>
                {{ profile.bio }}
            </q-card-section>
        </q-card-section>
    </q-card>
</template>
<script>
export default {
  name: 'ProfileCard',
  props: [ 'search', 'profile' ],
  data () {
    return {
      queries: ['Reda']
    }
  },
  computed: {
    fullName: function () {
      if (!this.profile.displayFullName.toLowerCase().includes(this.search.toLowerCase())) {
        return `${this.profile.givenName} ${this.profile.familyName}${this.profile.additionalName ? `. ${this.profile.additionalName}.` : ''}`
      }
      return this.profile.displayFullName
    }
  }
}
</script>
