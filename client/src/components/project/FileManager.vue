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
          <div class="q-px-sm contentsContainer">
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
          :data.sync="data"
          :volumesDialog.sync="volumesDialog"
          @addFolder="onAddFolder"
        />
      </q-dialog>

      <!-- File Uploaded Dialog  -->
      <q-dialog v-model="fileUploadDialog" position="standard">
        <!-- TODO: Pass the selected Folder id (the database id) as a prop to the FileUploader -->
        <FileUploader />
      </q-dialog>
    </div>
  </section>
</template>

<script>
import { uid, date, format } from 'quasar'
import { gql } from '@apollo/client'

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
    assetId: { type: Number, default: () => this.$route.params.projectId },
    icons: { type: Object, default: () => defaultIcons },
    columns: { type: Array, default: () => defaultColumns }
  },
  data () {
    return {
      data: [], // Database data
      nodes: [], // Tree nodes
      contents: [], // Contents of a selected node
      loadingNodes: true,
      loadingContents: true,
      selectedFolder: null,
      selectedFiles: [],
      volumesDialog: false,
      fileUploadDialog: false,
      maximizedToggle: true,
      splitterModel: 30
    }
  },
  async created () {
    await this.init()
  },
  watch: {
    selectedFolder (newFolderId, oldFolderId) {
      if (!newFolderId) {
        newFolderId = this.data[0].id
      }

      this.clearContents()
      this.contents.push(...this.getFolderContents(newFolderId))
      this.loadingContents = false
    },
    data: {
      deep: true,
      // We refrech the contents every time the data changes
      handler () {
        this.clearContents()
        this.contents.push(...this.getFolderContents(this.selectedFolder))
        this.loadingContents = false
      }
    },
    '$route': 'fetchData'
  },
  methods: {
    async init () {
      const assets = await this.fetchData()

      const rootFolder = {
        id: uid(),
        isDir: true,
        name: 'Root',
        expandable: true,
        lazy: true,
        children: []
      }

      if (_.isEmpty(assets)) {
        this.data = rootFolder
        return
      }

      const folders = assets.map((asset) => {
        const folders = _.get(asset, 'childAssets', [])
          .map((folder) => {
            const folderObj = {
              id: folder.id.toString(),
              name: folder.name,
              isDir: folder.assetType === 'folder',
              lazy: true,
              size: _.get(folder, 'childAssets', []).length,
              children: []
            }
            if (folder.assetType !== 'folder') console.log('Folders ', folderObj)
            const files = _.get(folder, 'childAssets', [])
              .map((file) => {
                return {
                  id: file.id.toString(),
                  name: file.name,
                  size: _.get(file, 'file.fileobject.size', 0),
                  format: _.get(file, 'file.fileFormatId', 'mp4'),
                  isDir: file.assetType === 'folder',
                  uploadedDatetime: file.datetimeCreated
                }
              })
            folderObj.children = files
            return folderObj
          })
        return folders
      })

      rootFolder.children = folders[0]
      this.data = [rootFolder]
      this.setSelectedFolder(rootFolder.id)
      this.nodes.push(...this.getFolders(this.selectedFolder))
      this.loadingNodes = false
    },
    async fetchData () {
      // Fetch Data will fetch pam's childAsset that could contains projects
      // The FileManager can only display folder so look only for folders
      const result = await this.$apollo.query({
        query: gql`
          query GetAssets($assetId: Int!) {
            assets(where: {id: {_eq: $assetId}, assetType: {_in: [pam,project]}}) {
              id
              name
              assetType
              datetimeCreated
              parentId
              childAssets(where: {assetType: {_eq: folder}}) {
                id
                name
                assetType        
                datetimeCreated
                parentId
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
          }
        `,
        variables: {
          assetId: this.assetId
        }
      })

      return _.get(result, 'data.assets', [])
    },
    clearContents () {
      this.contents.splice(0, this.contents.length)
    },
    async moveFile (fileId, folderId, newFolderId) {
      try {
        this.loadingContents = true
        const result = this.$apollo.mutate({
          mutation: gql`
            mutation ChangeParentId($assetId: Int!, $parentId: Int!) {
              update_assets(
                where: { id: {_eq: $assetId}}, 
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
            assetId: fileId,
            parentId: newFolderId
          }
        })
        const file = this.removeFile(folderId, fileId)
        this.addFile(newFolderId, file)
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
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

    loadChildren (node, key) {
      try {
        node['children'] = []
        if (node.children || node.children.length) {
          node.children.splice(0, node.children.length)
        }

        const folder = this.findItem(key)

        if (!folder || !folder.children) return []

        for (const child of folder.children) {
          // we only want folders
          if (!child.isDir) {
            continue
          }
          // add child to parent
          node.children.push(child)
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

    getFolderContents (folderId) {
      // Get the folder contents
      if (!folderId || typeof folderId !== 'string') return []

      const folder = this.findItem(folderId)

      if (!folder || !folder.children) return []

      let contents = []

      for (const child of folder.children) {
        contents.push(child)
      }

      return contents
    },

    getFolders (folderId) {
      if (!folderId || typeof folderId !== 'string') return []

      // We find the selected folder
      const folder = this.findItem(folderId)

      if (!folder || !folder.children) return []

      let folders = []

      for (const child of folder.children) {
        if (!child.isDir) continue
        const { children, ...folder } = child
        // const node = this.createNode(child)
        folders.push(folder)
      }

      return folders
    },

    findItem (itemId) {
      if (!itemId) return null

      let stack = []
      stack.push(this.data[0]) // We push the root
      while (stack.length > 0) {
        let node = stack.pop()

        if (node == null) continue

        if (node.id.toString() === itemId) {
          return node
        } else if (node.children && node.children.length) {
          for (let i = 0; i < node.children.length; i++) {
            stack.push(node.children[i])
          }
        }
      }
      return null
    },

    // Setters
    setSelectedFolder (folderId) {
      this.selectedFolder = folderId
    },
    setSelectedFiles (filesArray) {
      this.selectedFiles = filesArray
    },

    // Event handlers
    onLazyLoad ({ node, key, done, fail }) {
      if (this.loadChildren(node, key)) {
        done()
      } else {
        fail()
      }
    },
    async onMoveFile (fileId, folderId, newFolderId) {
      await this.moveFile(fileId, folderId, newFolderId)
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
      this.fileUploadDialog = show
    },
    onDblClicked (folderId, isDir) {
      if (isDir) {
        this.setSelectedFolder(folderId)
      }
    },
    async onAddFolder (folderName) {
      console.log('Add folder', folderName)
    }
  }
}
</script>
<style scoped>
.contentsContainer {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
