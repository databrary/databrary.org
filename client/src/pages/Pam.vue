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
              :selectedProject.sync="selectedProject"
            />
          </q-scroll-area>
        </template>
        <template v-slot:after>
          <div v-if="!createAssetType">
            <q-scroll-area
              :style="{height: ($q.screen.height-50-16-16-50-1)+'px'}"
              v-if="selectedProject"
            >
              <ProjectViewer
                :id="selectedProject"
              />
            </q-scroll-area>
            <FileManager
              v-else
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
    pamId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    firstModel: 20,
    secondModel: 30,
    assetId: null,
    createAssetType: null,
    selectedProject: null,
    projects: []
  }),
  created () {
    this.assetId = this.pamId || parseInt(this.$route.params.id)
  },
  computed: {
    isProjectsEmpty () {
      return this.projects.length === 0
    }
  },
  watch: {
    async pamId () {
      this.assetId = this.pamId
      this.reset()
    },
    async assetId () {
      this.projects = await this.fetchProjects()
      if (this.isProjectsEmpty) {
        await this.onInsertAsset('Default Project View')
      }
    }
  },
  methods: {
    getAssetsByType: call('assets/getAssetsByType'),
    insertAsset: call('assets/insertAsset'),

    async fetchProjects () {
      try {
        const data = await this.getAssetsByType({
          parentId: this.assetId,
          assetType: 'project'
        })

        return _.get(data, 'assets', [])
      } catch (error) {
        console.error(error.message)
      }
    },

    async onInsertAsset (name) {
      try {
        const { id } = await this.insertAsset({
          parentId: this.assetId,
          name: name,
          assetType: 'project',
          privacyType: 'private'
        })
        this.projects = await this.fetchProjects()
        this.selectedProject = id

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
      this.selectedProject = null
    }
  }
}
</script>
