<template>
  <div class="q-pa-sm">
    <Avatar
      v-for="collaborator in dataToShow"
      :key="collaborator.displayFullName"
      class="q-ma-xs"
      :size="avatarSize"
      :src="getAvatarSource(collaborator)"
    />
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
import Avatar from '@/components/shared/Avatar'

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
  components: {
    Avatar
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
    getAvatarSource (collaborator) {
      return collaborator.useGravatar
        ? JSON.parse(collaborator.gravatar).large
        : JSON.parse(collaborator.image).thumbnail // Using thumbnail temp (bug with large sizes not fetched)
    },
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
