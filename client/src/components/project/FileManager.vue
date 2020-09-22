<template>
  <section class="row q-pa-xs">
    <div class="col-xs-12 col-sm-12 col-md-12">
      <Toolbar
        :selected.sync="selectedFiles"
        @showVolumeDialog="onShowVolumeDialog"
        @showFileUploadDialog="onShowFileUploadDialog"
      />
      <q-splitter v-model="splitterModel" style="height: 400px" after-class="no-scroll">
        <template v-slot:before>
          <div class="q-pa-md">
            <Tree
              :data="data"
              :folder.sync="folderSelected"
              @selected="onSelectedFolder"
              @moveFile="onMoveFile"
            />
          </div>
        </template>
        <template v-slot:after>
          <div class="q-px-sm">
            <Grid
              :data="data"
              :icons="icons"
              :folder.sync="folderSelected"
              @selectedFiles="onSelectedFiles"
            />
          </div>
        </template>
      </q-splitter>

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
import Tree from './Tree'
import Grid from './Grid'
import Toolbar from './Toolbar'

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
  name: 'FileManager',
  components: {
    FileUploader,
    AddNewVolume,
    Tree,
    Grid,
    Toolbar
  },
  props: {
    icons: { type: Object, default: () => fileIcons },
    splitterModel: { type: Number, default: () => 30 }
  },
  data () {
    return {
      data: [], // Tree
      volumesDialog: false,
      fileUploadDialog: false,
      maximizedToggle: true,
      folderSelected: 'Data',
      selectedFiles: []
    }
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
                uploadedDatetime
                fileobject {
                  size
                }
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
    createNode (fileInfo) {
      // This will add a node to the tree
    },

    // Getters
    getFiles (folderId) {
      return this.data.find(ele => ele.id === folderId).children
    },
    getFolderContents (folder) {
      // Get the folder contents
    },
    getFolders (path) {
      // Get folders from path
    },

    // Setters
    setSelectedFolder (folder) {
      this.folderSelected = folder
    },
    setSelectedFiles (filesArray) {
      this.selectedFiles = filesArray
    },

    // Event handlers
    onMoveFile (fileId, folderId, newFolderId) {
      this.moveFile(fileId, folderId, newFolderId)
    },
    onSelectedFolder (folder) {
      this.setSelectedFolder(folder)
    },
    onSelectedFiles (filesArray) {
      this.setSelectedFiles(filesArray)
    },
    onShowVolumeDialog (show) {
      this.volumesDialog = show
    },
    onShowFileUploadDialog (show) {
      this.fileUploadDialog = show
    }

  }
}
</script>
