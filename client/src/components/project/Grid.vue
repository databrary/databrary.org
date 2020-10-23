<template>
  <div ref="contentsRef" class="contents-wrapper">
    <q-toolbar class="bg-white text-dark q-pa-sm">
      <q-btn
        flat
        icon="subdirectory_arrow_left"
        class="rotate-90"
        color="primary"
        :disable="selected === root"
        @click.stop="onClickBack()"
      >
        <q-tooltip>
          Go Back
        </q-tooltip>
      </q-btn>
      <q-btn
        flat
        label="Upload"
        icon="cloud_upload"
        color="primary"
        @click.stop="onClickUpload()"
      >
        <q-tooltip>
          Upload files
        </q-tooltip>
      </q-btn>

      <q-btn
        flat
        label="Add folder"
        icon="create_new_folder"
        color="primary"
        @click.stop="onClickAddNode()"
      >
        <q-tooltip>
          Add A New Folder
        </q-tooltip>
      </q-btn>
      <q-space />
      <q-btn-toggle
        flat
        v-model="viewSelected"
        push
        dense
        toggle-color="primary"
        :options="viewOptions"
      >
        <template v-slot:grid>
          <div class="row items-center no-wrap">
            <q-icon name="view_module" >
              <q-tooltip>
                Grid View
              </q-tooltip>
            </q-icon>
          </div>
        </template>

        <template v-slot:list>
          <div class="row items-center no-wrap">
            <q-icon name="format_list_bulleted">
              <q-tooltip>
                List View
              </q-tooltip>
            </q-icon>
          </div>
        </template>
      </q-btn-toggle>
    </q-toolbar>
    <div class="col-12">
      <q-table
        :grid="viewSelected === 'grid'"
        flat
        :data="nodes"
        :columns="columns"
        row-key="id"
        selection="multiple"
        :style="tableStyleObj"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        :selected.sync="selectedChildren"
        :loading="loading"
        color="primary"
      >
        <!-- List view: custom name column -->
        <template v-slot:body-cell-name="props">
          <q-td class="col-12">
            <div
              :ref="props.row.id"
              class="row-inline justify-start items-center cursor-pointer"
              draggable
              @dragstart="onDragStart($event, props.row)"
              @dragend="$event.currentTarget.style.opacity = ''"
              @dragenter.prevent="props.row.isDir ? setNodeActive(props.row.id, true): null"
              @dragover.prevent="props.row.isDir ? setNodeActive(props.row.id, true): null"
              @dragleave.prevent="props.row.isDir ? setNodeActive(props.row.id, false) : null"
              @drop="props.row.isDir ? onDrop($event, props.row.id) : null"
              @dblclick.prevent="props.row.isDir ? onDblClick($event, props.row) : null"
            >
              <q-icon
                class="col-2"
                size="sm"
                :name="props.row.isDir ? icons['folder'] : icons[props.row.format.toLowerCase()] || icons['other']"
              />
              <span
                class="col-10 q-ml-sm text-center"
              >
                {{props.row.name}}
              </span>
              <q-popup-edit
                :ref="`${props.row.id}-edit`"
                v-if="props.row.canEdit"
                v-model="props.row.name"
                @show="currentRef = props.row.id"
                @save="(value, initialValue) => saveNode(value, initialValue, props.row)"
                @cancel="(value, initialValue) => cancelNode(value, initialValue, props.row)"
                @hide="hideNode(props.row)"
              >
                <!-- @hide="hidePopupEdit(props.row)" -->
                <q-input
                  v-model.trim="props.row.name"
                  class="col-10 q-ml-sm"
                  dense
                  autofocus
                  type="text"
                  @focus="$event.target.select()"
                />
              </q-popup-edit>
            </div>
          </q-td>
        </template>
        <!-- Grid View Cards -->
        <template v-slot:item="props">
          <q-card
            flat
            :class="props.selected
              ? 'bg-grey-2 q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition justify-between content-start'
              : 'q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition justify-between content-start'"
            draggable
            @dragstart="onDragStart($event, props.row)"
            @drop="props.row.isDir ? onDrop($event, props.row.id) : null"
            @dragover.prevent
            @dblclick.prevent="props.row.isDir ? onDblClick($event, props.row.id, props.row.isDir) : null"
          >
            <q-card-section class="row">
              <q-checkbox dense v-model="props.selected" />
            </q-card-section>
            <q-card-section class="row justify-center" >
              <q-icon
                size="xl"
                :name="props.row.isDir ? icons['folder'] : icons[props.row.format.toLowerCase()] || icons['other']"
              />
            </q-card-section>
            <q-card-section class="row justify-center">
              <div class="text-center" >{{ props.row.name }}</div>
            </q-card-section>
          </q-card>
        </template>
      </q-table>
    </div>

    <q-dialog
      v-model="warnDuplicateName"
    >
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
            @click.prevent="showPopupEdit(currentRef)"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { uid } from 'quasar'
export default {
  name: 'Grid',
  props: {
    contents: {
      type: Array,
      required: true
    },
    icons: {
      type: Object,
      required: true
    },
    selectedNode: {
      type: String,
      required: false
    },
    columns: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    rootNode: {
      type: String,
      required: true,
      default: () => null
    }
  },
  data () {
    return {
      root: null, // the assetId of the root folder (pam | project)
      nodes: [],
      selectedChildren: [],
      selected: '',
      viewSelected: 'list',
      timer: null,
      delay: 200,
      viewOptions: [
        { value: 'grid', slot: 'grid' },
        { value: 'list', slot: 'list' }
      ],
      pagination: {
        rowsPerPage: 0
      },
      width: 175,
      height: 350,
      fontSize: 12,
      opacityOnDragged: 0.5,
      defaultName: 'New Folder',
      newFolderCount: 1,
      warnDuplicateName: false,
      currentRef: null
    }
  },
  mounted () {
    this.nodes = this.contents
    this.height = this.$parent.$el.offsetHeight
    this.selected = this.selectedNode
    this.root = this.rootNode
  },
  watch: {
    selectedNode () {
      if (this.selected === this.selectedNode) return

      this.selected = this.selectedNode
    },
    selected () {
      this.$emit('selected', this.selected)
    },
    selectedChildren () {
      this.$emit('selectedChildren', this.selectedChildren)
    },
    contents () {
      this.nodes = this.contents
    },
    rootNode () {
      this.root = this.rootNode
    }
  },
  computed: {
    tableStyleObj () {
      return {
        height: this.height + 'px'
      }
    }
  },
  methods: {
    setNodeActive (ref, isActive) {
      if (ref === this.selected) return

      if (isActive) this.$refs[ref].classList.add('bg-teal-1', 'text-grey-8')
      else this.$refs[ref].classList.remove('bg-teal-1', 'text-grey-8')
    },
    exists (id, name) {
      if (!name) throw new Error('Name argument is required!')
      return id
        ? this.contents.some((el) => el.id !== id && el.name === name)
        : this.contents.filter((el) => el.name === name).length >= 2
    },
    showPopupEdit (ref, ms = 300) {
      setTimeout(() => {
        const popEditRef = `${ref}-edit`
        if (this.$refs[popEditRef]) this.$refs[popEditRef].show()
      }, ms)
    },
    onDragStart (e, node) {
      e.currentTarget.style.opacity = this.opacityOnDragged
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      // We move all selected files, if not, only the draged one
      let children = [node]

      if (this.selectedChildren.length > 0) children = this.selectedChildren

      e.dataTransfer.setData('children', JSON.stringify(children))
      e.dataTransfer.setData('node', JSON.stringify(node))
    },
    onDrop (e, targetNodeId) {
      this.setNodeActive(targetNodeId, false)
      this.$emit('onDrop', e, targetNodeId)
    },
    onDblClick (e, node) {
      this.$emit('dblClick', node)
    },
    onClickUpload () {
      this.$emit('showFileUploadDialog', true)
    },
    onClickBack () {
      this.$emit('goBack')
    },
    onClickAddNode () {
      this.createNode()
    },
    createNode () {
      const newNode = {
        id: uid(),
        name: `${this.defaultName} ${this.newFolderCount}`,
        isDir: true,
        lazy: true,
        parentId: this.selected,
        uploadedDatetime: Date.now(),
        size: 0,
        canEdit: true
      }

      this.nodes.push(newNode)

      this.newFolderCount++
      // Wait for Quasar to update the table to show the popup edit
      this.showPopupEdit(newNode.id)
    },
    saveNode (value, initialValue, node) {
      try {
        if (this.exists(node.id, value)) {
          this.warnDuplicateName = true
          node.name = initialValue
          return
        }
        node.canEdit = false
        delete node.canEdit
        this.$emit('addNode', node)
      } catch (error) {
        console.error(error.message)
      }
    },
    cancelNode (value, initialValue, node) {
      node.name = value
      this.saveNode(value, initialValue, node)
    },
    hideNode (node) {
      // Check canEdit property to prevent from saving the node twice
      if (node.canEdit) return
      this.saveNode(node.name, node.name, node)
    }
  }
}
</script>
<style scoped>
.contents-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
