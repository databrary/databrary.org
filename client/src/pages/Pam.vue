<template>
  <q-page>
    <div v-if="!assetId" class="row">
      <q-spinner
        class="absolute-center"
        color="primary"
        size="3em"
      />
    </div>
    <div v-else class="q-pa-md">
      <q-splitter
        v-model="firstModel"
      >
        <template v-slot:before>
          <q-scroll-area
            :style="{height: ($q.screen.height-50-16-16-50-1)+'px'}"
          >
            <Projects
              :createAssetType.sync="createAssetType"
              :projects="projects"
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
                :assetId.sync="selectedView"
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
            @insert-asset="onInsertAsset"
          />
        </template>
      </q-splitter>
    </div>
  </q-page>
</template>

<script>
import { call } from 'vuex-pathify'
import _ from 'lodash'

import Projects from '../components/pam/Projects.vue'
import ProjectViewer from '@/pages/Project.vue'
import CreateAsset from '@/components/pam/CreateAsset.vue'
import FileManager from '@/components/fileManager/FileManager.vue'

export default {
  name: 'Dashboard',
  components: {
    Projects,
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
    selectedView: null,
    projects: []
  }),
  async created () {
    this.assetId = this.selected || parseInt(this.$route.params.id)
    this.forceRefresh = this.refresh
    await this.fetchProjects()
  },
  watch: {
    refresh () {
      this.forceRefresh = this.refresh
    },
    async selected () {
      this.selectedView = null
      this.assetId = this.selected
      await this.fetchProjects()
    }
  },
  methods: {
    getAssetsByType: call('assets/getAssetsByType'),
    insertAsset: call('assets/insertAsset'),

    async fetchProjects () {
      const data = await this.getAssetsByType({
        parentId: this.assetId,
        assetType: 'project'
      })

      this.projects = _.get(data, 'assets', [])
    },

    async onInsertAsset (name) {
      try {
        const { id } = await this.insertAsset({
          parentId: this.assetId,
          name: name,
          assetType: 'project',
          privacyType: 'private'
        })
        await this.fetchProjects()
        this.selectedView = id

        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
      } catch (error) {
        console.error('onInsertAsset::', error.message)
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Failed'
        })
      } finally {
        this.createAssetType = null
      }
    },
    reset () {
      this.selectedView = null
      this.assetId = this.selected
    }
  }
}
</script>
