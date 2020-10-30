<template>
  <div v-if="!assetId" class="row">
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
            <Panel1
              @onShowCreateAsset="showCreateAsset = true"
            />
          </q-scroll-area>
        </template>
        <template v-slot:after>
          <q-scroll-area
            :style="{height: ($q.screen.height-50-16-16-50-1)+'px'}"
            v-if="selectedProjectView && !showCreateAsset"
          >
            <ProjectViewer
              :projectId="selectedProjectView"
            />
          </q-scroll-area>
          <CreateAsset
            v-else-if="showCreateAsset"
            @onHideShowCreateAsset="showCreateAsset = false"
            assetType="project"
            :parentId="assetId"
          />
          <FileManager
            v-else-if="assetId && !showCreateAsset"
            :assetId="assetId"
            :height="$q.screen.height-50-16-16-50-1"
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
import ProjectViewer from './ProjectViewer.vue'
import CreateAsset from '@/components/project/pam/CreateAsset.vue'
import FileManager from '@/components/project/FileManager.vue'

import getAssetsByType from '@gql/getAssetsByType.gql'

export default {
  name: 'Dashboard',
  components: {
    Panel1,
    ProjectViewer,
    CreateAsset,
    FileManager
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    date,
    firstModel: 20,
    secondModel: 30,
    assetId: null,
    showCreateAsset: false
  }),
  created () {
    this.assetId = this.id
  },
  watch: {
    '$route': 'fetchData',
    async refreshViews () {
      if (this.refreshViews) {
        await this.fetchData()
        this.refreshViews = false
      }
    },
    id () {
      this.assetId = this.id
    },
    async assetId () {
      await this.fetchData()
    }

  },
  computed: {
    views: sync('pam/views'),
    refreshViews: sync('pam/refreshViews'),
    selectedProjectView: sync('pam/selectedProjectView')
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
