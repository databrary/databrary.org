<template>
  <section class="row q-pa-xs">
    <div class="col-xs-12 col-sm-12 col-md-12">
      <q-splitter v-model="splitterModel" :style="height ? {height: height+'px'} : {}">
        <template v-slot:before>
          <div class="q-pa-md tree-container">
            <Tree
              ref="tree"
              :nodes="nodes"
              :rootNode="rootNode"
              :icons="icons"
              :loading.sync="loadingNodes"
              :selectedNode.sync="selectedNode"
              @selected="onSelectedNode"
              @onDrop="onNodeDrop"
              :lazyLoad="onLazyLoad"
            />
          </div>
        </template>
        <template v-slot:after>
          <div class="q-px-sm contents-container">
            <Grid
              ref="grid"
              :contents.sync="contents"
              :icons="icons"
              :columns="columns"
              :selectedNode.sync="selectedNode"
              :loading.sync="loadingContents"
              :rootNode="rootNode"
              @selected="onSelectedNode"
              @onDrop="onNodeDrop"
              @addNode="onAddNode"
              @selectedChildren="onSelectedContents"
              @dblClick="onDblClicked"
              @goBack="onGoBack"
              @showFileUploadDialog="onShowFileUploadDialog"
            />
          </div>
        </template>
      </q-splitter>

      <!-- File Uploaded Dialog  -->
      <q-dialog v-model="showFileUploadDialog" position="standard">
        <FileUploader
          :parentId="parseInt(selectedNode)"
        />
      </q-dialog>

      <q-dialog v-model="confirm.show">
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm">Select an action!. Note all duplicate will not be processed!</span>
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
              @click="copyNode(confirm.children, confirm.target)"
              v-close-popup
            />
            <q-btn
              flat
              label="Move"
              color="primary"
              @click="moveNode(confirm.children, confirm.target)"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="alertDuplicateName">
        <q-card>
          <q-card-section>
            <div class="text-h6">Alert</div>
          </q-card-section>
          <q-card-section class="row items-center">
            <span class="q-mx-sm">Another file with the same name already exists in this folder</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="OK"
              color="primary"
              @click="showContentsPopupEdit()"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="fileViewer.show">
        <q-pdfviewer
          v-if="fileViewer.format === 'pdf'"
          v-model="fileViewer.show"
          :src="fileViewer.sources[0].src"
          type="html5"
          content-class="fit container"
          inner-content-class="fit container"
        />
        <q-media-player
          v-else
          type="video"
          background-color="black"
          :autoplay="true"
          :show-big-play-button="true"
          :sources="fileViewer.sources"
          track-language="English"
        >
        </q-media-player>
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
    assets(where: {id: {_eq: $assetId}, assetType: {_in: [pam, project, folder, file]}}, order_by: {datetimeCreated: desc}) {
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
      childAssets(order_by: {datetimeCreated: desc}) {
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
    columns: { type: Array, default: () => defaultColumns },
    height: null
  },
  data () {
    return {
      rootNode: null, // The assetId (pam | project) converted to string on created hook
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
        newNode: null,
        children: null
      }, // Object with data related to the move/copy action
      fileViewer: {
        show: false,
        format: null,
        sources: null
      },
      splitterModel: 30,
      alertDuplicateName: false
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

      await this.updateContents(newFolderId)

      newFolderId === this.rootNode ? this.goBackDisabled = true : this.goBackDisabled = false
    },
    assetId () {
      this.rootNode = this.assetId.toString()
    }
    // '$route': 'fetchData'
  },
  methods: {
    ...mapActions('assets', ['insertAsset', 'getAssetUrl']),

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

    clearConfirm () {
      this.confirm = {
        show: false,
        newNode: null,
        children: null
      }
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

    async copyNode (children, newNode) {
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

    async moveNode (children, targetNodeId) {
      try {
        // TODO: (Reda) query assets to check if file's name exists in target
        // const newContents = await this.fetchContents(newNode.id)
        // Check for every child if exists in newContents
        // remove child from children if exists in newContents
        // Show a warning listing files/folders that couldn't be moved

        const tmpContents = await this.fetchContents(targetNodeId)

        const newChildren = children.filter((child) => !this.existsInContents(child.id, child.name, tmpContents))
        const duplicateChildren = children.filter((child) => this.existsInContents(child.id, child.name, tmpContents))

        if (duplicateChildren.length) {
          const html = `
          <span>
          Another element(s) with the same name already exists in the destination folder
          <br />
          <ul>
          ${duplicateChildren.map((child) => (`<li>${child.name}</li>`)).join(' ')}
          </ul>
          </span>
          `

          this.$q.notify({
            type: 'warning',
            message: html,
            html: true
          })
        }

        if (_.isEmpty(newChildren)) return

        const result = this.$apollo.mutate({
          mutation: UPDATE_PARENT_ID,
          variables: {
            assets: children.map((child) => child.id),
            parentId: targetNodeId
          }
        })
        // FIXME: only update affected nodes in the tree instead of fetching the full data from the backend

        // Update the tree only when we are moving folders
        if (children.find((child) => child.isDir)) {
          await this.updateNodes(this.rootNode)
        }
        this.setSelectedNode(targetNodeId)

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

        this.setSelectedNode(node.parentId)
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
      // if (nodeId === this.selectedNode) return
      this.selectedNode = nodeId
    },
    setSelectedContents (nodesArray) {
      // if (nodesArray === this.selectedContents) return
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
    async setConfirmData (confirm) {
      this.confirm = confirm
    },
    onSelectedNode (nodeId) {
      this.setSelectedNode(nodeId)
    },
    onSelectedContents (nodesArray) {
      this.setSelectedContents(nodesArray)
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
    async onDblClicked (node) {
      if (node.isDir) {
        this.setSelectedNode(node.id)
        // We expand the parent in the Tree component
        if (node.parentId === this.rootNode) return
        if (node.parentId) this.$refs.tree.$refs.qtree.setExpanded(node.parentId, true)
      } else {
        // We request the URL for the file
        const data = await this.getAssetUrl(node.id)
        if (data) {
          this.fileViewer = {
            show: true,
            format: data.format,
            sources: [{ src: data.url, type: data.format === 'pdf' ? 'pdf' : 'video/mp4' }]
          }
        }
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
    async onAddNode (node, name, initialName) {
      try {
        if (name.length < 1) {
          node.name = initialName
          return
        }

        if (this.existsInContents(node.id, name)) {
          this.alertDuplicateName = true
          node.name = initialName
          return
        }

        node.canEdit = false
        node.initialName = ''
        delete node.canEdit
        delete node.initialName

        await this.addNode(node)
      } catch (error) {
        console.error(error.message)
      }
    },

    onNodeDrop (e, targetNodeId) {
      const oldNode = JSON.parse(e.dataTransfer.getData('node'))

      // prevent dropping in the same(source) folder
      // source and destination must be different
      if (oldNode.id === targetNodeId) return

      // don't drop on other draggables
      if (e.target.draggable === true) return

      const children = JSON.parse(e.dataTransfer.getData('children'))

      this.setConfirmData({ show: true, target: targetNodeId, children: children })
    },
    showContentsPopupEdit () {
      this.$refs.grid.showPopupEdit()
    },
    existsInContents (id, name, contents = this.contents) {
      if (!name) throw new Error('Name argument is required!')
      return id
        ? contents.some((el) => el.id !== id && el.name === name)
        : contents.filter((el) => el.name === name).length >= 2
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
