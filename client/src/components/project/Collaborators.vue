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
import { call } from 'vuex-pathify'
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
    collaborators: [],
    avatarSize: '40px'
  }),
  async created () {
    this.collaborators = await this.generateCollaborators()
  },
  watch: {
    async data () {
      this.collaborators = await this.generateCollaborators()
    }
  },
  computed: {
    dataToShow () {
      return this.collaborators.slice(0, this.show)
    }
  },
  methods: {
    getUserById: call('search/getUserById'),
    async generateCollaborators () {
      const collaborators = []
      for (const col of this.data) {
        if (!col.id) continue
        const userDoc = await this.getUserById({ id: col.id })
        collaborators.push({
          ...userDoc
        })
      }

      return collaborators
    }
  }
}
</script>
