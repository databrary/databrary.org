<template>
  <div v-if="!selected" class="row">
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
            <BookmarkPanel
              :createAssetType.sync="createAssetType"
              :assetId.sync="assetId"
              :selectedView.sync="selectedView"
              :selectedPam.sync="selectedPam"
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
              v-else-if="selectedPam"
              :assetId.sync="selectedPam"
              :height="$q.screen.height-50-16-16-50-1"
            />
            <FileManager
              v-else
              :assetId.sync="assetId"
              :height="$q.screen.height-50-16-16-50-1"
            />
          </div>
          <CreateAsset
            v-else
            :assetType.sync="createAssetType"
            :parentId="selectedPam"
          />
        </template>
      </q-splitter>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { date } from 'quasar'
import { defaultDataIdFromObject, gql } from '@apollo/client'
import { sync, get } from 'vuex-pathify'

import _ from 'lodash'

import Panel1 from './Panel1.vue'
import BookmarkPanel from './BookmarkPanel.vue'
import ProjectViewer from './ProjectViewer.vue'
import CreateAsset from '@/components/project/pam/CreateAsset.vue'
import FileManager from '@/components/project/FileManager.vue'

import getAssetsByType from '@gql/getAssetsByType.gql'

export default {
  name: 'Dashboard',
  components: {
    BookmarkPanel,
    ProjectViewer,
    CreateAsset,
    FileManager
  },
  props: {
    selected: {
      type: Number,
      required: true
    },
    refreshDashboard: {
      type: Boolean
    }
  },
  data: () => ({
    firstModel: 20,
    secondModel: 30,
    createAssetType: null,
    selectedView: null,
    selectedPam: null,
    refresh: false,
    assetId: null
  }),
  created () {
    this.assetId = this.selected
    this.refresh = this.refreshDashboard
  },
  watch: {
    refreshDashboard () {
      this.refresh = this.refreshDashboard
    },
    refresh () {
      this.selectedPam = null
      this.selectedView = null
      this.assetId = this.selected
      this.$emit('update:refreshDashboard', false)
    },
    selected () {
      this.selectedPam = null
      this.selectedView = null
      this.assetId = this.selected
    },
    selectedView () {
      if (this.selectedView != null) {
        this.selectedPam = null
      }
    },
    selectedPam () {
      if (this.selectedPam != null) {
        this.selectedView = null
      }
    }
  }
}
</script>
