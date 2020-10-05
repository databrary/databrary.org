<template>
  <div>
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
    projectIdFromRoute: null,
    asset: null
  }),
  watch: {
    '$route': 'fetchData'
  },
  async created () {
    this.projectIdFromRoute = this.$route.params.projectId
    this.fetchData()
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
          projectId: this.projectIdFromRoute
        }
      })
      this.asset = result.data.assets[0]
    }
  }
}
</script>
