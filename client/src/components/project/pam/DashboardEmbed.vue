<template>
  <div v-if="!pamId" class="row">
    <q-spinner
      class="absolute-center"
      color="primary"
      size="3em"
    />
  </div>
  <div v-else>
    <div class="q-pa-md">
      <q-splitter
        v-model="firstModel"
      >
        <template v-slot:before>
          <q-scroll-area
            :style="{height: ($q.screen.height-50-16-16-50-1)+'px'}"
          >
            <Panel1 />
          </q-scroll-area>
        </template>
        <template v-slot:after>
          <q-scroll-area
            :style="{height: ($q.screen.height-50-16-16-50-1)+'px'}"
            v-if="selectedProjectView && !createView"
          >
            <ProjectViewer
              :projectId="selectedProjectView"
            />
          </q-scroll-area>
          <CreateView
            v-else-if="createView"
          />
          <FileManager
            :assetId="assetId"
            :height="$q.screen.height-50-16-16-50-1"
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
import { sync, get } from 'vuex-pathify'

import _ from 'lodash'

import Panel1 from './Panel1.vue'
// import Panel2 from './Panel2.vue'
// import Panel3 from './Panel3.vue'
import ProjectViewer from './ProjectViewer.vue'
import CreateView from './CreateView.vue'
import FileManager from '@/components/project/FileManager.vue'

import getAssetsByType from '@gql/getAssetsByType.gql'

export default {
  name: 'Dashboard',
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
    assetId: null
  }),
  async created () {
    // this.generateCitation('http://doi.org/10.17910/B77P4V')
    this.assetId = this.pamId
  },
  watch: {
    '$route': 'fetchData',
    'viewCreated': 'fetchData',
    pamId () {
      this.assetId = this.pamId
    },
    async assetId () {
      await this.fetchData()
    }

  },
  computed: {
    views: sync('pam/views'),
    viewCreated: sync('pam/viewCreated'),
    pamId: get('pam/pamId'),
    selectedProjectView: sync('pam/selectedProjectView'),
    createView: sync('pam/createView')
  },
  methods: {
    async fetchData () {
      const { data } = await this.$apollo.query({
        query: getAssetsByType,
        variables: {
          parentId: this.assetId,
          assetType: 'project'
        }
      })
      this.views = _.get(data, 'assets', [])
    }
  }
}
</script>
