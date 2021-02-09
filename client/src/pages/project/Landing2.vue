<template>
  <div v-if="!asset" >
    <q-spinner
      class="absolute-center"
      color="primary"
      size="4em"
    />
  </div>
  <div v-else>
    <DashboardEmbed
      v-if="asset.assetType === 'pam'"
    />
    <Landing
      v-else
    />
  </div>
</template>
<script>
// TODO(Reda): Fetch project id info here
// import { date } from 'quasar'
import { gql } from '@apollo/client'

import DashboardEmbed from '@/components/pam/DashboardEmbed'
import Landing from '@/pages/project/Landing'

export default {
  name: 'Project',
  components: {
    DashboardEmbed,
    Landing
  },
  data: () => ({
    asset: null
  }),
  watch: {
    '$route': 'fetchData'
  },
  async created () {
    await this.fetchData()
  },
  methods: {
    async fetchData () {
      const result = await this.$apollo.query({
        query: gql`
          query GetProject($projectId: Int!) {
            assets(where: {
              id: {_eq: $projectId},
              assetType:  {_in: [pam, project]}
            }) {
              id
              assetType
              name
              datetimeCreated
            }
          }
        `,
        variables: {
          projectId: this.$route.params.projectId
        }
      })
      this.asset = result.data.assets[0]
    }
  }
}
</script>
