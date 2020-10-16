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
              ref="tree"
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
              :goBackDisabled.sync="goBackDisabled"
              @selected="onSelectedFolder"
              @moveFile="onMoveFile"
              @selectedChildren="onSelectedContents"
              @dblClick="onDblClicked"
              @goBack="onGoBack"
              @showFileUploadDialog="onShowFileUploadDialog"
            />
          </div>
        </template>
      </q-splitter>

      <!-- Create a new Volume Dialog  -->
      <!-- <q-dialog
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
      </q-dialog> -->

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
  folder: 'mdi-folder-outline',
  folderOpen: 'mdi-folder-open-outline',
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
      nodes: [], // Tree nodes
      contents: [], // Contents of a selected node, is updated on selectedFolder updates
      loadingNodes: true, // The state of the Tree component
      loadingContents: true, // The state of the Grid component
      goBackDisabled: true, // The state of the go back button in the Grid component
      selectedFolder: null, // The current selected folder (can be update from Grid and Tree)
      selectedFiles: [], // List of selected files/folders updated from the Grid component
      volumesDialog: false, // The state of the new volume dialog
      maximizedToggle: true, // new volume dialog maximized toggle
      showFileUploadDialog: false, // The state of the uppy upload dialog
      splitterModel: 30
    }
  },
  async created () {
    this.setSelectedFolder(this.assetId.toString())
    this.nodes.push(...await this.fetchFolders(this.selectedFolder))
    this.loadingNodes = false
  },
  watch: {
    async selectedFolder (newFolderId, oldFolderId) {
      if (!newFolderId) newFolderId = this.assetId

      this.loadingContents = true
      this.clearContents()
      this.contents.push(...await this.fetchFolderContents(newFolderId))
      this.loadingContents = false

      newFolderId === this.assetId.toString() ? this.goBackDisabled = true : this.goBackDisabled = false
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
            parentId: asset.parentId.toString(),
            uploadedDatetime: asset.datetimeCreated,
            size: _.get(asset, 'childAssets', []).length
          }

        case 'file':
          return {
            id: asset.id.toString(),
            name: asset.name,
            isDir: asset.assetType === 'folder',
            parentId: asset.parentId.toString(),
            uploadedDatetime: asset.datetimeCreated,
            // TODO: (Reda): Remove default values from here and add them to the ingest scripts
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
    async moveFile (children, oldNode, newNode) {
      // IMPORTANT: New node object is forwarded from the tree so we can alter the reference
      // IMPORTANT: oldNode is forwarded by the dataTransfer, therefore cannot alter the node
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
            assets: children.map((child) => child.id),
            parentId: newNode.id
          }
        })
        // FIXME: only update affected nodes in the tree instead of fetching the full data from the backend

        // Update the tree only when we are moving folders
        if (children.find((child) => child.isDir)) {
          this.loadingNodes = true
          this.nodes.push(...await this.fetchFolders(this.selectedFolder))
          this.loadingNodes = false
        }
        this.setSelectedFolder(newNode.id)
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
    async fetchFolderContents (folderId) {
      // Get the folder contents
      if (!folderId) return []

      const result = await this.fetchData(folderId)

      let contents = []

      for (const child of _.get(result, 'childAssets', [])) {
        contents.push(this.createNode(child))
      }

      return contents.filter((el) => el != null)
    },

    async fetchFolders (assetId) {
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
      try {
        const assets = await this.fetchData(key)
        let children = []
        for (const asset of _.get(assets, 'childAssets', [])) {
          // we only want folders
          if (asset.assetType !== 'folder') continue

          // add child to parent
          children.push(this.createNode(asset))
        }

        done(children)
      } catch (error) {
        fail()
      }
    },
    async onMoveFile (children, oldNode, newNode) {
      await this.moveFile(children, oldNode, newNode)
    },
    onSelectedFolder (folderId) {
      this.setSelectedFolder(folderId)
    },
    onSelectedContents (filesArray) {
      this.setSelectedFiles(filesArray)
    },
    onShowVolumeDialog (show) {
      this.volumesDialog = show
    },
    onShowFileUploadDialog (show) {
      this.showFileUploadDialog = show
    },

    /**
     * Emmited from the Grid compenent
     * on folder's double click event
     */
    onDblClicked (node) {
      if (node.isDir) {
        this.setSelectedFolder(node.id)
        // We expand the parent in the Tree component
        if (node.parentId === this.assetId.toString()) return
        if (node.parentId) this.$refs.tree.$refs.qtree.setExpanded(node.parentId, true)
      }
    },

    /**
     * Emmited from the Grid compenent
     * on Go Back click event
     */
    onGoBack () {
      if (this.selectedFolder === this.assetId.toString()) return

      const node = this.$refs.tree.$refs.qtree.getNodeByKey(this.selectedFolder)

      if (!node || !node.parentId) return

      this.setSelectedFolder(node.parentId)
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
