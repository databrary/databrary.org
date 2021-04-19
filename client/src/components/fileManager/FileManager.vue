<template>
  <section class="row q-pa-xs">
    <div class="col-12">
      <q-splitter
        v-model="splitterModel"
        before-class="row no-scroll"
        after-class="row no-scroll"
        :style="height ? {height: height+'px'} : {}"
      >
        <template v-slot:before>
          <Tree
            ref="tree"
            :nodes="nodes"
            :rootNode="rootNode"
            :icons="icons"
            :loading.sync="loadingNodes"
            :selectedNode.sync="selectedNode"
            :lazyLoad="onLazyLoad"
            :height.sync="height"
            :filter='filter'
            @onDrop="onNodeDrop"
            @onDragStart="onNodeDragStart"
          />
        </template>
        <template v-slot:after>
          <Toolbar
            :isRootNode="selectedNode === rootNode"
            :selectedView.sync="selectedView"
            :viewOptions="viewOptions"
            :showFileUploadDialog.sync="showFileUploadDialog"
            :selectedContentsSize="selectedContents.length"
            @filter="(value) => filter = value"
            @go-back="onGoBack"
            @add-node="onAddNode"
            @edit-node="onEditNode"
            @delete-node="onDeleteNodes"
            @clear-selection="clearSelectedContents"
          />
          <Grid
            ref="grid"
            :contents.sync="contents"
            :icons="icons"
            :columns="columns"
            :selectedNode.sync="selectedNode"
            :selectedContents.sync="selectedContents"
            :loading.sync="loadingContents"
            :selectedView="selectedView"
            :height.sync="height"
            :filter='filter'
            @save-node="onSaveNode"
            @onDrop="onNodeDrop"
            @onDragStart="onNodeDragStart"
          />
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
    </div>
  </section>
</template>

<script>
import { uid, date, format } from 'quasar'
import { gql } from '@apollo/client'
import { get } from 'vuex-pathify'
import { mapActions } from 'vuex'

import _ from 'lodash'

import FileUploader from '@/components/upload/FileUploader'
import Confirmation from '@/components/shared/modals/Confirmation'
import Tree from './Tree'
import Grid from './Grid'
import Toolbar from './Toolbar'

const defaultViewOptions = [
  { value: 'grid', slot: 'grid' },
  { value: 'list', slot: 'list' }
]

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
    assets(where: {id: {_eq: $assetId}, assetType: {_in: [list, pam, project, folder, file]}}, order_by: {datetimeCreated: desc}) {
      id
      name
      assetType
      datetimeCreated
      parentId
      listAssets
      childAssets_aggregate {
        aggregate {
          count(columns: id)
        }
      }
      files {
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
        listAssets
        childAssets_aggregate {
          aggregate {
            count(columns: id)
          }
        }
        files {
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
    Tree,
    Grid,
    Toolbar,
    Confirmation
  },
  props: {
    assetId: { type: Number, required: true },
    icons: { type: Object, default: () => defaultIcons },
    columns: { type: Array, default: () => defaultColumns },
    viewOptions: { type: Array, default: () => defaultViewOptions },
    defaultView: { type: String, default: () => 'list' }
  },
  data () {
    return {
      rootNode: null, // The assetId (pam | project) converted to string on created hook
      assets: [], // raw data fetched
      nodes: [], // Tree nodes
      contents: [], // Contents of a selected node, is updated on selectedNode updates
      loadingNodes: true, // The state of the Tree component
      loadingContents: true, // The state of the Grid component
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
      splitterModel: 30,
      alertDuplicateName: false,
      selectedView: null,
      filter: ''
    }
  },
  async created () {
    this.rootNode = this.assetId.toString()
    this.selectedView = this.defaultView
  },
  computed: {
    selectedBookmark: get('pam/selectedBookmark'),
    height () {
      return this.$q.screen.height - 50 - 16 - 50
    }
  },
  watch: {
    async selectedNode (newVal, oldVal) {
      if (this.isContentsError()) {
        this.selectedNode = oldVal
        return
      }

      if (this.isContentsUnSaved() || this.isContentsInEditMode()) {
        this.$q.dialog({
          component: Confirmation,
          parent: this, // becomes child of this Vue node
          text: 'You have unsaved changes that will be lost',
          title: 'Unsaved Changes',
          okLabel: 'SAVE',
          cancelLabel: 'DISCARD'
        }).onOk(async () => {
          this.saveAll()
          await this.updateSelectedNode()
        }).onCancel(async () => {
          await this.updateSelectedNode()
        }).onDismiss(() => {})
      } else {
        await this.updateSelectedNode()
      }
    },
    assetId () {
      this.rootNode = this.assetId.toString()
    },
    async rootNode () {
      this.setSelectedNode(this.rootNode)
      await this.updateNodes(this.rootNode)
    },
    defaultView () {
      this.selectedView = this.defaultView
    }
  },
  methods: {
    ...mapActions('assets', ['insertAsset', 'updateAsset', 'deleteAssets']),

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

      return {
        id: asset.id.toString(),
        name: asset.name,
        isDir: asset.assetType === 'folder',
        parentId: asset.parentId.toString(),
        uploadedDatetime: asset.datetimeCreated,
        lazy: asset.assetType === 'folder',
        size: asset.assetType === 'folder'
          ? _.get(asset, 'childAssets_aggregate.aggregate.count', 0)
          : _.get(asset, 'file.fileobject.size', 0),
        format: asset.assetType === 'file'
          ? _.get(asset, 'file.fileFormatId', 'mp4')
          : null,
        initialName: asset.name,
        edit: asset.edit != null ? asset.edit : false,
        saved: asset.saved != null ? asset.saved : true
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

        let data = _.get(result, 'data.assets[0]', [])

        if (this.selectedBookmark && !_.isEmpty(_.get(data, 'listAssets', []))) {
          for (const assetId of _.get(data, 'listAssets', [])) {
            const result = await this.$apollo.query({
              query: GET_ASSETS,
              variables: {
                assetId: assetId
              }
            })
            const asset = _.get(result, 'data.assets[0]')

            if (asset.assetType === 'pam' || asset.assetType === 'project') continue

            data.childAssets.push(asset)
          }
        }

        return data
      } catch (error) {
        throw new Error(`fetchData::${error.message}`)
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
          if (child.assetType !== 'file' && child.assetType !== 'folder') continue
          contents.push(this.createNode(child))
        }

        // if (this.assetType === 'list') {
        //   for (const assetId of _.get(assets, 'listAssets', [])) {
        //     const asset = await this.fetchData(assetId)
        //     if (asset.assetType === 'pam' || asset.assetType === 'project') continue
        //     contents.push(this.createNode(asset))
        //   }
        // }

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

        // if (this.assetType === 'list') {
        //   for (const assetId of _.get(assets, 'listAssets', [])) {
        //     const asset = await this.fetchData(assetId)
        //     if (asset.assetType !== 'folder') continue
        //     nodes.push(this.createNode(asset))
        //   }
        // }

        return nodes.filter((el) => el != null)
      } catch (error) {
        throw new Error(error.message)
      }
    },

    async updateSelectedNode () {
      if (this.selectedNode == null) this.selectedNode = this.rootNode

      await this.updateContents(this.selectedNode)

      if (this.selectedNode === this.rootNode) {
        this.collapseAll()
        return
      }

      // expand the selectedNode's parent in the tree
      const node = this.getNodeByKey(this.selectedNode)

      if (node == null) return

      this.setNodeExpanded(node.id, true)
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
        throw new Error(`updateNodes:: ${error.message}`)
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
        this.clearSelectedContents()
        this.clearContents()
        this.contents.push(...await this.fetchContents(assetId))
        this.loadingContents = false
      } catch (error) {
        throw new Error(`updateContents:: ${error.message}`)
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

        const newChildren = children.filter((child) => !this.existInContents(tmpContents, child.id, child.name))
        const duplicateChildren = children.filter((child) => this.existInContents(tmpContents, child.id, child.name))

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
        this.notifySuccess('Moved')
      } catch (error) {
        this.notifyFailure()
        throw new Error(`moveNode:: ${error.message}`)
      } finally {
        this.clearConfirm()
      }
    },

    /**
     * delete an existing folder in the node's parent
     *
     */
    async delete (assets) {
      try {
        await this.deleteAssets({ assets })

        if (this.selectedNode === this.rootNode) await this.updateNodes(this.rootNode)

        this.setSelectedNode(null)
        this.notifySuccess('Deleted')
      } catch (error) {
        this.notifyFailure()
        throw new Error(`deleteNodes:: ${error.message}`)
      }
    },

    goBack () {
      if (this.selectedNode === this.rootNode) return

      const node = this.getNodeByKey(this.selectedNode)

      if (!node || !node.parentId) return

      this.setSelectedNode(node.parentId)
    },

    async saveNode (node) {
      try {
        if (node.saved) {
          // update the asset
          const assetName = await this.updateAsset(
            {
              name: node.name,
              assetId: node.id
            }
          )

          node.initialName = node.name

          this.notifySuccess('Updated')
        } else {
          // insert a new asset
          const { id } = await this.insertAsset(
            {
              name: node.name,
              assetType: 'folder',
              privacyType: 'private',
              parentId: node.parentId
            }
          )

          node.initialName = node.name
          node.id = id.toString()

          this.notifySuccess('Created')
        }

        node.saved = true

        if (this.setSelectedNode === this.rootNode) await this.updateNodes(this.rootNode)

        this.setSelectedNode(node.parentId)
      } catch (error) {
        this.notifyFailure()
        throw new Error(`saveNode:: ${error.message}`)
      } finally {
        node.edit = false
      }
    },

    deleteNodes () {
      this.$q.dialog({
        component: Confirmation,
        parent: this, // becomes child of this Vue node
        text: 'Are you sure you want to permanently remove this items',
        title: 'Confirm Deletion'
      }).onOk(async () => {
        await this.delete(this.selectedContents.map((el) => parseInt(el.id)))
      }).onCancel(() => {
      }).onDismiss(() => {})
    },

    addNode () {
      try {
        // we need to save all unsaved changes
        this.saveAll()

        const newAsset = {
          id: uid(),
          name: this.getNewName(),
          assetType: 'folder',
          parentId: this.selectedNode,
          datetimeCreated: Date.now(),
          size: 0,
          edit: true,
          saved: false
        }

        const newNode = this.createNode(newAsset)

        this.contents.unshift(newNode)
      } catch (error) {
        this.notifyFailure()
        throw new Error(`addNode:: ${error.message}`)
      }
    },

    getNewName () {
      let max = 0
      this.contents.forEach((node) => {
        const match = new RegExp('^New Folder \\d{1,2}$').exec(node.name.trim())
        if (match && match.length === 1) {
          max = Math.max(max, parseInt(match[0].split(' ').pop()))
        }
      })
      return `New Folder ${max + 1}`
    },

    saveAll () {
      this.contents.every(async (node) => {
        if (node.edit || !node.saved) {
          this.saveNode(node)
        }
      })
    },

    existInContents (contents, id, name) {
      if (!id) throw new Error('Node Id is required!')
      return contents.some((el) => el.id !== id && el.name === name)
    },

    isContentsUnSaved () {
      return this.contents.some((el) => el.saved === false)
    },

    isContentsInEditMode () {
      return this.selectedContents.some((el) => el.edit === true)
    },

    isContentsError () {
      return this.$refs.grid.isError()
    },

    editNode () {
      if (this.selectedContents.length !== 1) return
      this.selectedContents[0].edit = true
    },

    notifySuccess (message, icon = 'cloud_done', color = 'green-4') {
      this.$q.notify({
        color,
        textColor: 'white',
        icon,
        message
      })
    },

    notifyFailure (message = 'Failed', icon = 'cloud_done', color = 'red-4') {
      this.$q.notify({
        color,
        textColor: 'white',
        icon,
        message
      })
    },

    getNodeByKey (key) {
      return this.$refs.tree.$refs.qtree.getNodeByKey(this.selectedNode)
    },

    setNodeExpanded (key, expand) {
      if (key === this.rootNode || key == null) return

      this.$refs.tree.$refs.qtree.setExpanded(key, expand)
    },

    setSelectedNode (nodeId) {
      this.selectedNode = nodeId
    },

    setConfirmData (confirm) {
      this.confirm = confirm
    },

    collapseAll () {
      this.$refs.tree.$refs.qtree.collapseAll()
    },

    clearContents () {
      this.contents.splice(0, this.contents.length)
    },

    clearNodes () {
      this.nodes.splice(0, this.nodes.length)
    },

    clearSelectedContents () {
      this.$refs.grid.clearSelection()
    },

    clearConfirm () {
      this.confirm = {
        show: false,
        newNode: null,
        children: null
      }
    },

    // Event handlers
    async onLazyLoad ({ node, key, done, fail }) {
      try {
        const assets = await this.fetchData(key)
        let children = []
        for (const asset of _.get(assets, 'childAssets', [])) {
          if (asset.assetType !== 'folder') continue
          children.push(this.createNode(asset))
        }

        done(children)
      } catch (error) {
        fail()
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

    onNodeDragStart (e, sourceNode, children) {
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('children', JSON.stringify(children))
      e.dataTransfer.setData('node', JSON.stringify(sourceNode))
    },

    onEditNode () {
      this.editNode()
    },
    onAddNode () {
      this.addNode()
    },
    onDeleteNodes () {
      this.deleteNodes()
    },
    onGoBack () {
      this.goBack()
    },
    onSaveNode (node) {
      this.saveNode(node)
    }
  }
}
</script>
