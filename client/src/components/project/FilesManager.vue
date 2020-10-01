<template>
  <section class="row q-pa-xs">
    <q-toolbar class="no-padding bg-white text-dark q-mt-sm">
      <q-toolbar-title>Files</q-toolbar-title>
      <q-btn
        flat
        icon="cloud_upload"
        color="primary"
        label="Upload"
        @click="fileUploadDialog = true"
      >
        <q-tooltip>
          Upload files or folders to your project
        </q-tooltip>
      </q-btn>
      <q-btn
        flat
        icon="folder"
        color="primary"
        label="Create Virtual Volume"
        @click="volumesDialog = true"
      >
        <q-tooltip>Create a new volume from selected data</q-tooltip>
      </q-btn>
    </q-toolbar>

    <div class="col-xs-12 col-sm-12 col-md-12">
      <!-- Create a new Volume Dialog  -->
      <q-dialog
        v-model="volumesDialog"
        persistent
        :maximized="maximizedToggle"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <AddNewVolume :data.sync="data" :volumesDialog.sync="volumesDialog" />
      </q-dialog>

      <!-- File Uploaded Dialog  -->
      <q-dialog v-model="fileUploadDialog" position="standard">
        <FileUploader />
      </q-dialog>
    </div>
  </section>
</template>

<script>
import { uid } from 'quasar'
import { gql } from '@apollo/client'

import FileUploader from '../upload/FileUploader'
import AddNewVolume from './modals/AddNewVolume'

export default {
  name: 'FilesManager',
  components: {
    FileUploader,
    AddNewVolume
  },
  data: () => ({
    data: [], // Tree
    volumesDialog: false,
    fileUploadDialog: false,
    maximizedToggle: true
  }),
  watch: {
    '$route': 'fetchData'
  },
  async created () {
    this.fetchData(this.$route.params.projectId)
  },
  methods: {
    async fetchData (projectId) {
      const result = await this.$apollo.query({
        query: gql`
          query getProjectFiles($projectId: Int!) {
            assets(where: { id: {_eq: $projectId}}) {
              files {
                name
                fileFormatId
                fileobject {
                  size
                }
                uploadedDatetime
              }
            }
          }
        `,
        variables: {
          projectId: projectId
        }
      })
      const projectFiles = result.data.assets[0].files
      const files = projectFiles.map(
        ({ name: label, fileFormatId: format, fileobject: { size }, uploadedDatetime }) =>
          ({ id: uid(), label, size, format, uploadedDatetime, icon: 'insert_drive_file' })
      )
      this.data.push(
        {
          id: uid(),
          label: 'Session 1',
          icon: 'folder',
          expandable: false,
          children: [...files]
        }
      )
      this.data.push(
        {
          id: uid(),
          label: 'Session 2',
          icon: 'folder',
          expandable: false,
          children: [
            {
              id: uid(),
              label: 'Fake Picture.png',
              size: 13245,
              format: 'png',
              uploadedDatetime: new Date(),
              icon: 'insert_drive_file'
            }
          ]
        }
      )
    }
  }
}
</script>
