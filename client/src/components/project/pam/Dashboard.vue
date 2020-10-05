<template>
  <div>
    <q-toolbar>
      <q-toolbar-title>
        {{ asset.name }}
      </q-toolbar-title>
      <q-btn
        :to="asset.id + '/contributors'"
        flat
        icon="person"
        label="Contributors"
      />
    </q-toolbar>
    <div class="q-pa-md">
      <q-splitter
        v-model="firstModel"
        :style="{height: ($q.screen.height-50-16)+'px'}"
      >
        <template v-slot:before>
          <q-scroll-area
            :style="{height: ($q.screen.height-50-16)+'px'}"
          >
            <Panel1 />
          </q-scroll-area>
        </template>
        <template v-slot:after>
          <ProjectViewer
            :projectId = "selectedProjectView"
            v-if="selectedProjectView && !createView"
          />
          <CreateView
            v-else-if="createView"
          />
          <FileManager
            :assetId = "asset.id"
            v-else
          />
        </template>
      </q-splitter>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { date } from 'quasar'
import { gql } from '@apollo/client'
import { sync } from 'vuex-pathify'

import Panel1 from './Panel1.vue'
// import Panel2 from './Panel2.vue'
// import Panel3 from './Panel3.vue'
import ProjectViewer from './ProjectViewer.vue'
import CreateView from './CreateView.vue'
import FileManager from '@/components/project/FileManager.vue'

export default {
  name: 'PageIndex',
  components: {
    Panel1,
    // Panel2,
    // Panel3,
    ProjectViewer,
    CreateView,
    FileManager
  },
  data: () => ({
    date,
    firstModel: 20,
    secondModel: 30,
    datetimeCreated: null
  }),
  watch: {
    '$route': 'fetchData',
    'viewCreated': 'fetchData'
  },
  async created () {
    // this.generateCitation('http://doi.org/10.17910/B77P4V')
    this.pamId = this.$route.params.projectId
    this.fetchData()
  },
  computed: {
    asset: sync('pam/asset'),
    views: sync('pam/views'),
    viewCreated: sync('pam/viewCreated'),
    pamId: sync('pam/pamId'),
    selectedProjectView: sync('pam/selectedProjectView'),
    createView: sync('pam/createView')
  },
  methods: {
    async fetchData () {
      this.views = []
      const result = await this.$apollo.query({
        query: gql`
          query GetProject($projectId: Int!) {
            pam: assets(where: {
              id: {_eq: $projectId},
              assetType: {_eq: pam}
            }) {
              id
              assetType
              name
              datetimeCreated
            },
            views: assets(
              where: {assetType: {_eq: project}, parentId: {_eq: $projectId}},
              order_by: {datetimeCreated: desc}
            ) {
              id
              name
              datetimeCreated
            }
          }
        `,
        variables: {
          projectId: this.pamId
        }
      })
      this.asset = result.data.pam[0]
      this.views = result.data.views
      this.datetimeCreated = date.formatDate(
        this.asset.datetimeCreated,
        'YYYY-MM-DD'
      )
    }
  }
}
</script>
