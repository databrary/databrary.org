<template>
  <q-card
    class="row"
    square
    flat
    bordered
  >
    <q-item class="col-12">
      <q-item-section avatar>
        <q-avatar>
          <img v-if="profile.useGravatar" :src="JSON.parse(profile.gravatar).large" />
          <img v-else :src="JSON.parse(profile.image).large" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ profile.displayFullName }}</q-item-label>
        <q-item-label caption>
          Institution placeholder
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>
<script>
export default {
  name: 'ProfileCard',
  props: ['profile']
}
</script>
