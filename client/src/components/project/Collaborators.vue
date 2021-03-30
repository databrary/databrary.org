<template>
  <div class="q-pa-sm">
    <q-avatar
      class="q-ma-xs"
      :size="avatarSize"
      v-for="collaborator in dataToShow"
      :key="collaborator.displayFullName"
    >
      <q-img
        v-if="collaborator.useGravatar"
        :src="JSON.parse(collaborator.gravatar).large"
        :title="collaborator.displayFullName"
      />
      <q-img
        v-else
        :src="JSON.parse(collaborator.image).large"
        :title="collaborator.displayFullName"
      />
    </q-avatar>
    <q-avatar
      v-if="data > dataToShow"
      class="q-ma-xs bg-grey-4"
      :size="avatarSize"
      :title="data.slice(show).map((el) => el.displayFullName).join('\n')"
    >
      {{`+${data.length - dataToShow.length}`}}
    </q-avatar>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    show: {
      type: Number,
      required: false,
      default: () => 3
    }
  },
  data: () => ({
    avatarSize: '40px'
  }),
  computed: {
    dataToShow () {
      return this.data.slice(0, this.show)
    }
  }
}
</script>
