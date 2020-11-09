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
              :createAssetType.sync="createAssetType"
              :assetId.sync="assetId"
              :selectedView.sync="selectedView"
            />
          </q-scroll-area>
        </template>
        <template v-slot:after>
          <div v-if="!createAssetType">
            <q-scroll-area
              :style="{height: ($q.screen.height-50-16-16-50-1)+'px'}"
              v-if="selectedView"
            >
              <ProjectViewer
                :projectId.sync="selectedView"
              />
            </q-scroll-area>
            <FileManager
              v-else-if="assetId"
              :assetId="assetId"
              :height="$q.screen.height-50-16-16-50-1"
            />
          </div>
          <CreateAsset
            v-else
            :assetType.sync="createAssetType"
            :parentId="assetId"
          />
        </template>
      </q-splitter>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { date } from 'quasar'
import { gql } from '@apollo/client'

import _ from 'lodash'

import Panel1 from './Panel1.vue'
import BookmarkPanel from './BookmarkPanel.vue'
import ProjectViewer from './ProjectViewer.vue'
import CreateAsset from '@/components/project/pam/CreateAsset.vue'
import FileManager from '@/components/project/FileManager.vue'

export default {
  name: 'Dashboard',
  components: {
    Panel1,
    ProjectViewer,
    CreateAsset,
    FileManager
  },
  props: {
    selected: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    firstModel: 20,
    secondModel: 30,
    assetId: null,
    createAssetType: null,
    selectedView: null
  }),
  created () {
    this.assetId = this.selected
    this.forceRefresh = this.refresh
  },
  watch: {
    refresh () {
      this.forceRefresh = this.refresh
    },
    selected () {
      this.selectedView = null
      this.assetId = this.selected
    }
  },
  methods: {
    reset () {
      this.selectedView = null
      this.assetId = this.selected
    }
  }
}
</script>
