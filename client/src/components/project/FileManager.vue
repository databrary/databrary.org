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
import { mapActions } from 'vuex'

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
  other: 'mdi-file-outline'
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
    icons: { type: Object, default: () => defaultIcons },
    columns: { type: Array, default: () => defaultColumns }
  },
  data () {
    return {
      data: [], // Database data
      nodes: [], // Tree nodes
      contents: [], // Contents of a selected node
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
    },
    data: {
      deep: true,
      // We refrech the contents every time the data changes
      handler () {
        this.clearContents()
        this.contents.push(...this.getFolderContents(this.selectedFolder))
      }
    }
  },
  methods: {
    ...mapActions('assets', ['fetchProjectAssets']),
    async init () {
      const filesData = await this.fetchProjectAssets(this.$route.params.projectId)
      const files = filesData.map(
        ({ name, fileFormatId: format, fileobject: { size }, uploadedDatetime }) =>
          ({ id: uid(), name, size, format, uploadedDatetime, isDir: false })
      )

      const rootFolder = {
        id: uid(),
        isDir: true,
        name: 'Root',
        icon: this.icons['folder'],
        expandable: true,
        lazy: true,
        children: []
      }

      // TODO: (Reda) Move this to createNode
      rootFolder.children.push(
        {
          id: uid(),
          name: 'Data',
          isDir: true,
          icon: this.icons['folder'],
          lazy: true,
          size: files.length,
          children: [...files]
        }
      )
      rootFolder.children.push(
        {
          id: uid(),
          name: 'Fake Volume',
          isDir: true,
          icon: this.icons['folder'],
          lazy: true,
          size: 2,
          children: [
            {
              id: uid(),
              name: 'Fake Picture.png',
              size: 13245,
              format: 'png',
              isDir: false,
              uploadedDatetime: new Date()
            },
            {
              id: uid(),
              name: 'Fake Nested Volume',
              isDir: true,
              icon: 'mdi-folder',
              format: 'folder',
              size: 0,
              children: [
                {
                  id: uid(),
                  name: 'Fake Nested Volume 2',
                  isDir: true,
                  icon: this.icons['folder'],
                  lazy: true,
                  size: 2
                }
              ]
            }
          ]
        }
      )
      this.data = [rootFolder]
      this.setSelectedFolder(rootFolder.id)
      this.nodes.push(...this.getFolders(this.selectedFolder))
    },
    clearContents () {
      this.contents.splice(0, this.contents.length)
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

    createNode (fileInfo) {
      // This will add a node to the tree
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
      let stack = []
      stack.push(this.data[0]) // We push the root
      while (stack.length > 0) {
        let node = stack.pop()
        if (node.id === itemId) {
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
    onMoveFile (fileId, folderId, newFolderId) {
      this.moveFile(fileId, folderId, newFolderId)
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
