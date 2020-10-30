<template>
  <div v-if="asset">
    <q-toolbar>
      <q-toolbar-title>
        {{ asset.name }}
      </q-toolbar-title>
      <!-- TODO: (Reda) This btn is used in multiple places, need to be refactored as component -->
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
      >
        <template v-slot:before>
          <q-scroll-area
            :style="{height: ($q.screen.height-50-16-50)+'px'}"
          >
            <Panel1
              @onShowCreateAsset="showCreateAsset = true"
            />
          </q-scroll-area>
        </template>
        <template v-slot:after>
          <ProjectViewer
            :projectId="selectedProjectView"
            v-if="selectedProjectView && !showCreateAsset"
          />
          <CreateAsset
            v-else-if="showCreateAsset"
            @onHideShowCreateAsset="showCreateAsset = false"
            assetType="project"
            :parentId="assetId"
          />
          <FileManager
            :assetId="asset.id"
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

import _ from 'lodash'

import Panel1 from './Panel1.vue'
import ProjectViewer from './ProjectViewer.vue'
import CreateAsset from '@/components/project/pam/CreateAsset.vue'
import FileManager from '@/components/project/FileManager.vue'

export default {
  name: 'Dashboard',
  props: ['id'],
  components: {
    Panel1,
    ProjectViewer,
    CreateAsset,
    FileManager
  },
  data: () => ({
    date,
    firstModel: 20,
    secondModel: 30,
    datetimeCreated: null,
    showCreateAsset: false
  }),
  watch: {
    '$route': 'fetchData',
    'viewCreated': 'fetchData'
  },
  async created () {
    // this.generateCitation('http://doi.org/10.17910/B77P4V')
    this.pamId = this.id || this.$route.params.projectId
    this.fetchData()
  },
  computed: {
    views: sync('pam/views'),
    viewCreated: sync('pam/viewCreated'),
    pamId: sync('pam/pamId'),
    selectedProjectView: sync('pam/selectedProjectView')
  },
  methods: {
    async fetchData () {
      this.views = []
      const result = await this.$apollo.query({
        query: gql`
          query GetProject($projectId: Int!) {
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
      this.asset = _.get(result, 'data.pam[0]', {})
      this.views = _.get(result, 'data.views', [])
      this.datetimeCreated = date.formatDate(
        this.asset.datetimeCreated,
        'YYYY-MM-DD'
      )
    }
  }
}
</script>
