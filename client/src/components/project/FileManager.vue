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
      <FileViewer
        @moveFile="moveFile"
        :icons="icons"
        :data.sync="data"
      />

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
import FileViewer from './FileViewer'

const fileIcons = {
  zip: 'mdi-folder-zip-outline',
  rar: 'mdi-folder-zip-outline',
  json: 'mdi-json',
  md: 'mdi-language-markdown-outline',
  pdf: 'mdi-file-pdf',
  png: 'mdi-file-image',
  jpg: 'mdi-file-image',
  jpeg: 'mdi-file-image',
  mp4: 'mdi-filmstrip',
  mkv: 'mdi-filmstrip',
  avi: 'mdi-filmstrip',
  wmv: 'mdi-filmstrip',
  mov: 'mdi-filmstrip',
  txt: 'mdi-file-document-outline',
  xls: 'mdi-file-excel',
  csv: 'mdi-file-delimited-outline',
  other: 'mdi-file-outline'
}

export default {
  name: 'FilesManager',
  components: {
    FileUploader,
    FileViewer,
    AddNewVolume
  },
  props: {
    icons: { type: Object, default: () => fileIcons }
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
            assets(where: {assetType: {_eq: project}, id: {_eq: $projectId}}) {
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
          ({ id: uid(), label, size, format, uploadedDatetime, isDir: false })
      )
      this.data.push(
        {
          id: uid(),
          label: 'Data',
          isDir: true,
          icon: 'mdi-folder',
          expandable: false,
          children: [...files]
        }
      )
      this.data.push(
        {
          id: uid(),
          label: 'Fake Volume',
          isDir: true,
          icon: 'mdi-folder',
          expandable: false,
          children: [
            {
              id: uid(),
              label: 'Fake Picture.png',
              size: 13245,
              format: 'png',
              isDir: false,
              uploadedDatetime: new Date()
            }
          ]
        }
      )
    },
    moveFile (fileId, folderId, newFolderId) {
      const file = this.removeFile(folderId, fileId)
      this.addFile(newFolderId, file)
    },
    removeFile (folderId, fileId) {
      // Return the removed file's data
      let files = this.getFiles(folderId)
      const file = files.splice(files.map(e => e.id).indexOf(fileId), 1)
      return file[0]
    },
    addFile (folderId, file) {
      let files = this.getFiles(folderId)
      files.push(file)
    },
    getFiles (folderId) {
      return this.data.find(ele => ele.id === folderId).children
    }
  }
}
</script>
