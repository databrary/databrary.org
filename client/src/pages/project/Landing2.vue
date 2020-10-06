<template>
  <div v-if="!asset" >
    <q-spinner
      class="absolute-center"
      size="4em"
    />
  </div>
  <div v-else>
    <Dashboard
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

import Dashboard from '@/components/project/pam/Dashboard'
import Landing from '@/pages/project/Landing'

export default {
  name: 'Project',
  components: {
    Dashboard,
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
