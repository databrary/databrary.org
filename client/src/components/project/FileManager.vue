<template>
  <section class="row q-pa-xs">
    <div class="col-xs-12 col-sm-12 col-md-12">
      <!-- <Toolbar
        :selected.sync="selectedFiles"
        @showVolumeDialog="onShowVolumeDialog"
        @showFileUploadDialog="onShowFileUploadDialog"
      /> -->
      <q-splitter v-model="splitterModel" before-class="window-height" after-class="no-scroll window-height">
        <template v-slot:before>
          <div class="q-pa-md tree-container">
            <Tree
              :nodes="nodes"
              :icons="icons"
              :loading.sync="loadingNodes"
              :selectedNode.sync="selectedFolder"
              @selected="onSelectedFolder"
              @moveFile="onMoveFile"
              :lazyLoad="onLazyLoad"
            />
          </div>
        </template>
        <template v-slot:after>
          <div class="q-px-sm contents-container">
            <Grid
              :children.sync="contents"
              :icons="icons"
              :columns="columns"
              :selectedNode.sync="selectedFolder"
              :loading.sync="loadingContents"
              @selected="onSelectedFolder"
              @moveFile="onMoveFile"
              @selectedFiles="onSelectedFiles"
              @dblClick="onDblClicked"
              @showFileUploadDialog="onShowFileUploadDialog"
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
        <AddNewVolume
          :nodes.sync="data"
          :icons="icons"
          :volumesDialog.sync="volumesDialog"
          @addFolder="onAddFolder"
        />
      </q-dialog>

      <!-- File Uploaded Dialog  -->
      <q-dialog v-model="showFileUploadDialog" position="standard">
        <FileUploader :parentId="parseInt(selectedFolder)"/>
      </q-dialog>
    </div>
  </section>
</template>

<script>
import { uid, date, format } from 'quasar'
import { gql } from '@apollo/client'
import { mapActions } from 'vuex'

import _ from 'lodash'

import FileUploader from '../upload/FileUploader'
import AddNewVolume from './modals/AddNewVolume'
import Tree from './Tree'
import Grid from './Grid'
import Toolbar from './Toolbar'

const defaultIcons = {
  folder: 'mdi-folder',
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
  other: 'mdi-file'
}

const defaultColumns = [
  {
    name: 'name',
    label: 'Name',
    required: true,
    align: 'left',
    sortable: true,
    field: row => row.name, // Make sure that the fields matches the field's name that you are getting from data
    format: val => `${val}`
  },
  {
    name: 'size',
    label: 'Size',
    required: true,
    align: 'left',
    sortable: true,
    field: row => row.size,
    format: (val, row) => row.isDir ? `${val} items` : `${format.humanStorageSize(val)}`
  },
  {
    name: 'uploaded',
    label: 'Uploaded on',
    required: true,
    align: 'left',
    sortable: true,
    field: row => row.uploadedDatetime,
    format: (val, row) => val ? `${date.formatDate(val, 'MM-DD-YYYY')}` : null
  }
  // {
  //   name: 'Format',
  //   label: 'Format',
  //   required: true,
  //   align: 'left',
  //   sortable: true,
  //   field: row => row.format,
  //   format: val => `${val}`
  // }
]

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
    assetId: { type: Number, required: true },
    icons: { type: Object, default: () => defaultIcons },
    columns: { type: Array, default: () => defaultColumns }
  },
  data () {
    return {
      assets: [],
      // The id of the root folder must match the pam/project Id
      data: [
        {
          id: this.assetId.toString(),
          isDir: true,
          name: 'Root',
          expandable: true,
          lazy: true,
          children: []
        }
      ], // Database data
      nodes: [], // Tree nodes
      contents: [], // Contents of a selected node
      loadingNodes: true,
      loadingContents: true,
      selectedFolder: null,
      selectedFiles: [],
      volumesDialog: false,
      showFileUploadDialog: false,
      maximizedToggle: true,
      splitterModel: 30
    }
  },
  async created () {
    this.setSelectedFolder(this.assetId.toString())
    this.nodes.push(...await this.getFolders(this.selectedFolder))
    this.loadingNodes = false
  },
  watch: {
    async selectedFolder (newFolderId, oldFolderId) {
      if (!newFolderId) {
        newFolderId = this.data[0].id
      }

      this.loadingContents = true
      this.clearContents()
      this.contents.push(...await this.getFolderContents(newFolderId))
      this.loadingContents = false
    },
    data: {
      deep: true,
      // We refrech the contents every time the data changes
      async handler () {
        this.loadingContents = true
        this.clearContents()
        this.contents.push(...await this.getFolderContents(this.selectedFolder))
        this.loadingContents = false
      }
    }
    // '$route': 'fetchData'
  },
  methods: {
    ...mapActions('assets', ['insertAsset']),
    createNode (asset) {
      if (!asset.assetType) {
        console.error('assetType is required! Make use to add the field to you GraphQL query')
        return null
      }

      switch (asset.assetType) {
        case 'folder':
          return {
            id: asset.id.toString(),
            name: asset.name,
            isDir: asset.assetType === 'folder',
            lazy: true,
            parentId: asset.parentId,
            uploadedDatetime: asset.datetimeCreated,
            size: _.get(asset, 'childAssets', []).length,
            children: []
          }

        case 'file':
          return {
            id: asset.id.toString(),
            name: asset.name,
            isDir: asset.assetType === 'folder',
            parentId: asset.parentId,
            uploadedDatetime: asset.datetimeCreated,
            // TODO: (Reda): Remove default values from here and them to the ingest scripts
            size: _.get(asset, 'file.fileobject.size', 0),
            format: _.get(asset, 'file.fileFormatId', 'mp4')
          }

        default:
          return null
      }
    },
    async fetchData (assetId) {
      const result = await this.$apollo.query({
        query: gql`
          query GetAssets($assetId: Int!) {
            assets(where: {id: {_eq: $assetId}, assetType: {_in: [pam, project, folder, file]}}) {
              id
              name
              assetType
              datetimeCreated
              parentId
              file {
                id
                name
                fileFormatId
                uploadedDatetime
                fileobject {
                  size
                }
              }
              childAssets {
                id
                name
                assetType
                datetimeCreated
                parentId
                file {
                  id
                  name
                  fileFormatId
                  uploadedDatetime
                  fileobject {
                    size
                  }
                }
              }
            }
          }
        `,
        variables: {
          assetId: assetId
        }
      })

      return _.get(result, 'data.assets[0]', [])
    },
    clearContents () {
      this.contents.splice(0, this.contents.length)
    },
    async moveFile (children, folderId, newFolderId) {
      try {
        this.loadingContents = true
        const result = this.$apollo.mutate({
          mutation: gql`
            mutation ChangeParentId($assets: [Int!]!, $parentId: Int!) {
              update_assets(
                where: { id: {_in: $assets}}, 
                _set: {parentId: $parentId}) 
              {
                returning {
                  id
                  parentId
                }
              }
            }
          `,
          variables: {
            assets: children,
            parentId: newFolderId
          }
        })

        // filesArray.every((fileId) => {
        //   const files = this.removeFile(folderId, fileId)
        //   this.addFile(newFolderId, files)
        //   this.$q.notify({
        //     color: 'green-4',
        //     textColor: 'white',
        //     icon: 'cloud_done',
        //     message: 'Submitted'
        //   })
        //   return true
        // })
      } catch (error) {
        console.error('moveFile::', error.message)
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Failed'
        })
      } finally {
        this.loadingContents = false
      }
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

    async loadChildren (node, key) {
      try {
        node['children'] = []
        if (node.children || node.children.length) {
          node.children.splice(0, node.children.length)
        }

        const assets = await this.fetchData(key)

        for (const asset of _.get(assets, 'childAssets', [])) {
          // we only want folders
          if (asset.assetType !== 'folder') continue

          // add child to parent
          node.children.push(this.createNode(asset))
        }
        return true
      } catch (err) {
        console.error('Error: ', err)
      }
      return false
    },

    // Getters
    getFiles (folderId) {
      return this.findItem(folderId).children
    },

    async getFolderContents (folderId) {
      // Get the folder contents
      if (!folderId) return []

      const result = await this.fetchData(folderId)

      let contents = []

      for (const child of _.get(result, 'childAssets', [])) {
        contents.push(this.createNode(child))
      }

      return contents.filter((el) => el != null)
    },

    async getFolders (assetId) {
      if (!assetId) return []

      const assets = await this.fetchData(assetId)

      const nodes = []

      for (const asset of _.get(assets, 'childAssets', [])) {
        if (asset.assetType !== 'folder') continue
        nodes.push(this.createNode(asset))
      }

      return nodes.filter((el) => el != null)
    },

    async addFolder (folder) {
      try {
        await this.insertAsset(
          {
            name: folder.label,
            assetType: 'folder',
            privacyType: 'private',
            parentId: this.assetId
          }
        )
      } catch (error) {
        console.error('Error', error.message)
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Failed'
        })
      }
    },

    // Setters
    setSelectedFolder (folderId) {
      this.selectedFolder = folderId
    },
    setSelectedFiles (filesArray) {
      this.selectedFiles = filesArray
    },

    // Event handlers
    async onLazyLoad ({ node, key, done, fail }) {
      if (await this.loadChildren(node, key)) {
        done()
      } else {
        fail()
      }
    },
    async onMoveFile (children, folderId, newFolderId) {
      await this.moveFile(children, folderId, newFolderId)
    },
    onSelectedFolder (folderId) {
      this.setSelectedFolder(folderId)
    },
    onSelectedFiles (filesArray) {
      this.setSelectedFiles(filesArray)
    },
    onShowVolumeDialog (show) {
      this.volumesDialog = show
    },
    onShowFileUploadDialog (show) {
      this.showFileUploadDialog = show
    },
    onDblClicked (folderId, isDir) {
      if (isDir) {
        this.setSelectedFolder(folderId)
      }
    },
    async onAddFolder (folder) {
      await this.addFolder(folder)
    }
  }
}
</script>
<style scoped>
.contents-container {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.tree-container {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
