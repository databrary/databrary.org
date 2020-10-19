<template>
  <section class="row q-pa-xs">
    <div class="col-xs-12 col-sm-12 col-md-12">
      <!-- <Toolbar
        :selected.sync="selectedContents"
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
              :selectedNode.sync="selectedNode"
              @selected="onSelectedNode"
              @moveNode="onMoveNode"
              :lazyLoad="onLazyLoad"
            />
          </div>
        </template>
        <template v-slot:after>
          <div class="q-px-sm contents-container">
            <Grid
              :contents.sync="contents"
              :icons="icons"
              :columns="columns"
              :selectedNode.sync="selectedNode"
              :loading.sync="loadingContents"
              :goBackDisabled.sync="goBackDisabled"
              @selected="onSelectedNode"
              @moveNode="onMoveNode"
              @addNode="onAddNode"
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
          @addNode="onAddNode"
        />
      </q-dialog> -->

      <!-- File Uploaded Dialog  -->
      <q-dialog v-model="showFileUploadDialog" position="standard">
        <FileUploader
          :parentId="parseInt(selectedNode)"
        />
      </q-dialog>

      <q-dialog v-model="confirm.show">
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm">Select an action!.</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Cancel"
              color="primary"
              @click="clearConfirm()"
              v-close-popup
            />
            <q-btn
              flat
              label="Copy"
              disable
              color="primary"
              @click="copyNode(confirm.children, confirm.oldNode, confirm.newNode)"
              v-close-popup
            />
            <q-btn
              flat
              label="Move"
              color="primary"
              @click="moveNode(confirm.children, confirm.oldNode, confirm.newNode)"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
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

const GET_ASSETS = gql`
  query GetAssets($assetId: Int!) {
    assets(where: {id: {_eq: $assetId}, assetType: {_in: [pam, project, folder, file]}}) {
      id
      name
      assetType
      datetimeCreated
      parentId
      childAssets_aggregate {
        aggregate {
          count(columns: id)
        }
      }
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
        childAssets_aggregate {
          aggregate {
            count(columns: id)
          }
        }
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
`

const UPDATE_PARENT_ID = gql`
  mutation UpdateParentId($assets: [Int!]!, $parentId: Int!) {
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
`

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
      rootNode: null, // The assetId converted to string on created hook
      nodes: [], // Tree nodes
      contents: [], // Contents of a selected node, is updated on selectedNode updates
      loadingNodes: true, // The state of the Tree component
      loadingContents: true, // The state of the Grid component
      goBackDisabled: true, // The state of the go back button in the Grid component
      selectedNode: null, // The current selected node (can be updated from Grid and Tree)
      selectedContents: [], // List of selected files/folders updated from the Grid component
      volumesDialog: false, // The state of the new volume dialog
      maximizedToggle: true, // new volume dialog maximized toggle
      showFileUploadDialog: false, // The state of the uppy upload dialog
      confirm: {
        show: false,
        oldNode: null,
        newNode: null,
        children: null
      }, // Object with data related to the move/copy action
      splitterModel: 30
    }
  },
  async created () {
    this.rootNode = this.assetId.toString()
    this.setSelectedNode(this.rootNode)
    await this.updateNodes(this.selectedNode)
  },
  watch: {
    async selectedNode (newFolderId, oldFolderId) {
      if (!newFolderId) newFolderId = this.rootNode

      this.updateContents(newFolderId)

      newFolderId === this.rootNode ? this.goBackDisabled = true : this.goBackDisabled = false
    },
    assetId () {
      this.rootNode = this.assetId.toString()
    }
    // '$route': 'fetchData'
  },
  methods: {
    ...mapActions('assets', ['insertAsset']),

    /**
     * Create a node model structure from asset's object, handles folder
     * and file asset types that are used respectively for the quasar tree
     * and quasar table components
     * see https://quasar.dev/vue-components/tree#Nodes-model-structure
     *
     * @param {Object} asset - asset to be added to the nodes and contents array
     */
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
            size: _.get(asset, 'childAssets_aggregate.aggregate.count', 0)
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

    /**
     * fetch asset's childAssets
     *
     * @param {String} assetId - Database asset id
     */
    async fetchData (assetId) {
      try {
        const result = await this.$apollo.query({
          query: GET_ASSETS,
          variables: {
            assetId: assetId
          }
        })

        return _.get(result, 'data.assets[0]', [])
      } catch (error) {
        console.error('fetchData::', error.message)
        throw new Error(error.message)
      }
    },

    clearContents () {
      this.contents.splice(0, this.contents.length)
    },

    clearNodes () {
      this.nodes.splice(0, this.nodes.length)
    },

    /**
     * Clear and update the nodes array
     *
     * @param {String} assetId - Database asset id
     */
    async updateNodes (assetId) {
      try {
        this.loadingNodes = true
        this.clearNodes()
        this.nodes.push(...await this.fetchNodes(assetId))
        this.loadingNodes = false
      } catch (error) {
        console.error('updateNodes::', error.message)
      } finally {
        this.loadingNodes = false
      }
    },

    /**
     * Clear and update the contents array
     *
     * @param {String} assetId - Database asset id
     */
    async updateContents (assetId) {
      try {
        this.loadingContents = true
        this.clearContents()
        this.contents.push(...await this.fetchContents(assetId))
        this.loadingContents = false
      } catch (error) {
        console.error('updateContents::', error.message)
      } finally {
        this.loadingContents = false
      }
    },

    clearConfirm () {
      this.confirm = {
        show: false,
        oldNode: null,
        newNode: null,
        children: null
      }
    },
    async copyNode (children, oldNode, newNode) {
      // IMPORTANT: New node object is forwarded from the tree so we can alter the reference
      // IMPORTANT: oldNode is forwarded by the dataTransfer, therefore cannot alter the node
      // TODO: (Reda) put copy logic here!
    },

    /**
     * Change the parent id of the children and update the tree and grid components
     *
     * @param {Array} children - children nodes to be moved
     * @param {Object} oldNode - source node where the move started
     * @param {Object} newNode - target node where the children will be moved to
     */

    async moveNode (children, oldNode, newNode) {
      // IMPORTANT: New node object is forwarded from the tree so we can alter the reference
      // IMPORTANT: oldNode is forwarded by the dataTransfer, therefore cannot alter the node
      try {
        const result = this.$apollo.mutate({
          mutation: UPDATE_PARENT_ID,
          variables: {
            assets: children.map((child) => child.id),
            parentId: newNode.id
          }
        })
        // FIXME: only update affected nodes in the tree instead of fetching the full data from the backend

        // Update the tree only when we are moving folders
        if (children.find((child) => child.isDir)) {
          await this.updateNodes(this.rootNode)
        }
        this.setSelectedNode(newNode.id)

        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Moved'
        })
      } catch (error) {
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Failed'
        })
      } finally {
        this.clearConfirm()
      }
    },

    /**
     * Fetch childAssets of an asset id and update the contents array,
     * the contents is forwarded to the Grid component and display files
     * and folders of a selected tree node.
     *
     * @param {String} assetId - Database asset id
     */
    async fetchContents (assetId) {
      try {
        // Get the folder contents
        if (!assetId) return []

        const assets = await this.fetchData(assetId)

        let contents = []

        for (const child of _.get(assets, 'childAssets', [])) {
          contents.push(this.createNode(child))
        }

        return contents.filter((el) => el != null)
      } catch (error) {
        throw new Error(error.message)
      }
    },

    /**
     * Fetch childAssets of an asset id and update the nodes array,
     * the nodes is forwarded to the Tree component and display folders
     * and sub-folders of a project|pam.
     *
     * @param {String} assetId - Database asset id
     */
    async fetchNodes (assetId) {
      try {
        if (!assetId) return []

        const assets = await this.fetchData(assetId)

        const nodes = []

        for (const asset of _.get(assets, 'childAssets', [])) {
          if (asset.assetType !== 'folder') continue
          nodes.push(this.createNode(asset))
        }

        return nodes.filter((el) => el != null)
      } catch (error) {
        throw new Error(error.message)
      }
    },

    /**
     * Insert a new folder in the node's parent
     *
     * @param {Object} node - object forwarded from the Grid components
     */
    async addNode (node) {
      try {
        const assetId = await this.insertAsset(
          {
            name: node.name,
            assetType: 'folder',
            privacyType: 'private',
            parentId: node.parentId
          }
        )

        node.id = assetId

        await this.updateNodes(this.rootNode)
        this.setSelectedNode(this.selectedNode)
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Created'
        })
      } catch (error) {
        console.error('addNode::', error.message)
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Failed'
        })
      }
    },

    // Setters
    setSelectedNode (nodeId) {
      this.selectedNode = nodeId
    },
    setSelectedContents (nodesArray) {
      this.selectedContents = nodesArray
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
    async onMoveNode (children, oldNode, newNode) {
      this.confirm = {
        show: true,
        oldNode: oldNode,
        newNode: newNode,
        children: children
      }
    },
    onSelectedNode (nodeId) {
      this.setSelectedNode(nodeId)
    },
    onSelectedContents (nodesArray) {
      this.setSelectedContents(nodesArray)
    },
    onShowVolumeDialog (show) {
      this.volumesDialog = show
    },
    onShowFileUploadDialog (show) {
      this.showFileUploadDialog = show
    },

    /**
     * Emmited from the Grid component
     * on folder's double click event.
     *
     * @param {Object} node - node object
     */
    onDblClicked (node) {
      if (node.isDir) {
        this.setSelectedNode(node.id)
        // We expand the parent in the Tree component
        if (node.parentId === this.rootNode) return
        if (node.parentId) this.$refs.tree.$refs.qtree.setExpanded(node.parentId, true)
      }
    },

    /**
     * Emmited from the Grid component
     * on Go Back click event
     */
    onGoBack () {
      if (this.selectedNode === this.rootNode) return

      const node = this.$refs.tree.$refs.qtree.getNodeByKey(this.selectedNode)

      if (!node || !node.parentId) return

      this.setSelectedNode(node.parentId)
    },

    /**
     * Emmited from the Grid component
     * on Add Folder action
     */
    async onAddNode (node) {
      await this.addNode(node)
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
