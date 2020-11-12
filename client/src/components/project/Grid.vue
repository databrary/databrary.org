<template>
  <div ref="contentsRef" class="col-12">
    <div class="col-12">
      <q-table
        ref="table"
        :grid="view === 'grid'"
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
              class="row justify-start items-center cursor-pointer"
              draggable
              @dragstart="onDragStart($event, props.row)"
              @dragend="$event.currentTarget.style.opacity = ''"
              @dragenter.prevent="props.row.isDir ? setNodeActive($event, props.row.id, true): null"
              @dragover.prevent="props.row.isDir ? setNodeActive($event,props.row.id, true): null"
              @dragleave.prevent="props.row.isDir ? setNodeActive($event,props.row.id, false) : null"
              @drop="props.row.isDir ? onDrop($event, props.row.id) : null"
              @dblclick.prevent="props.row.isDir ? selected = props.row.id : getFile(props.row.id)"
              @click.prevent="props.selected = !props.selected"
            >
              <q-icon
                class="col-2"
                size="sm"
                :name="props.row.isDir
                  ? icons['folder']
                  : props.row.format && props.row.format.toLowerCase() in icons
                    ? icons[props.row.format.toLowerCase()] : icons['other']"
              />
              <q-input
                v-if="props.row.edit"
                :ref="`${props.row.id}-edit`"
                v-model.trim="props.row.name"
                class="col-10"
                dense
                autofocus
                type="text"
                hide-bottom-space
                :bottom-slots="false"
                :error-message="errorMessage"
                :error="!isValid(props.row)"
                @focus="$event.target.select()"
                @keydown.enter="onEnterEvent(props.row)"
                @keydown.esc="onEscEvent(props.row)"
                @blur="onBlurEvent(props.row)"
              />
                <!--  -->
              <span
                v-else
                class="col-10"
              >
                {{props.row.name}}
              </span>
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
            @dblclick.prevent="props.row.isDir ? selected = props.row.id : getFile(props.row.id)"
          >
            <q-card-section class="row">
              <q-checkbox dense v-model="props.selected" />
            </q-card-section>
            <q-card-section class="row justify-center" >
              <q-icon
                size="xl"
                :name="props.row.isDir
                  ? icons['folder']
                  : props.row.format && props.row.format.toLowerCase() in icons
                    ? icons[props.row.format.toLowerCase()] : icons['other']"
              />
            </q-card-section>
            <q-card-section class="row justify-center">
              <div class="text-center" >{{ props.row.name }}</div>
            </q-card-section>
          </q-card>
        </template>
      </q-table>
    </div>
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
</template>

<script>
import { uid } from 'quasar'
import { mapActions } from 'vuex'

import _ from 'lodash'

export default {
  name: 'Grid',
  props: {
    contents: {
      type: Array,
      required: true
    },
    selectedContents: {
      type: Array,
      required: true
    },
    selectedView: {
      type: String,
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
    height: {
      type: Number,
      default: () => this.$q.screen.height - 50 - 16 - 50 - 55
    }
  },
  data () {
    return {
      nodes: [],
      selectedChildren: [],
      selected: null,
      timer: null,
      delay: 200,
      pagination: {
        rowsPerPage: 0
      },
      width: 175,
      fontSize: 12,
      opacityOnDragged: 0.5,
      defaultName: 'New Folder',
      newFolderCount: 1,
      warnDuplicateName: false,
      lastRef: null, // lastRef is used when an error occurs while saving a node
      view: null,
      fileViewer: {
        show: false,
        format: null,
        sources: null
      },
      error: false,
      errorMessage: 'Field is required'
    }
  },
  mounted () {
    this.nodes = this.contents
    this.selected = this.selectedNode
    this.view = this.selectedView
  },
  watch: {
    selectedNode () {
      if (this.selected === this.selectedNode) return

      this.selected = this.selectedNode
    },
    selected () {
      this.$emit('update:selectedNode', this.selected)
    },
    selectedChildren () {
      this.$emit('update:selectedContents', this.selectedChildren)
    },
    contents () {
      this.nodes = this.contents
    },
    selectedView () {
      this.view = this.selectedView
    }
  },
  computed: {
    tableStyleObj () {
      return {
        height: this.height - 55 + 'px'
      }
    }
  },
  methods: {
    ...mapActions('assets', ['getAssetUrl']),

    clearSelection () {
      this.$refs.table.clearSelection()
    },

    exists (node) {
      if (!node.id) throw new Error('Name is required!')
      return this.nodes.some((el) => el.id !== node.id && el.name === node.name)
    },

    isValid (node) {
      if (node.name.length <= 0) {
        this.errorMessage = 'Field is required'
        this.error = true
        return false
      }

      if (this.exists(node)) {
        this.errorMessage = 'Name already exists'
        this.error = true
        return false
      }

      this.errorMessage = null
      this.error = false
      return true
    },

    isNodeSaved (node) {
      return node.saved
    },

    setNodeEdit (node, edit) {
      node.edit = edit
    },

    isNodeNameChanged (node) {
      return node.initialName !== node.name
    },

    onEnterEvent (node) {
      this.saveNode(node)
    },

    onEscEvent (node) {
      node.name = node.initialName
      // This timeout is needed to wait for the input validation
      // We can call isValid() as well
      setTimeout(() => {
        this.saveNode(node)
      }, 100)
    },

    onBlurEvent (node) {
      this.saveNode(node)
    },

    saveNode (node) {
      if (this.isError()) {
        return
      }
      if (this.isNodeSaved(node) && !this.isNodeNameChanged(node)) {
        this.setNodeEdit(node, false)
        return
      }
      if (!this.isNodeSaved(node) || this.isNodeNameChanged(node)) { this.$emit('save-node', node) }
    },

    setNodeActive (e, ref, isActive) {
      if (ref === this.selected) return

      if (isActive) this.$refs[ref].classList.add('bg-teal-1', 'text-grey-8')
      else this.$refs[ref].classList.remove('bg-teal-1', 'text-grey-8')
    },

    onDragStart (e, node) {
      e.currentTarget.style.opacity = this.opacityOnDragged

      // We move all selected files, if not, only the draged one
      let children = this.selectedChildren.length > 0
        ? this.selectedChildren
        : [node]

      this.$emit('onDragStart', e, node, children)
    },

    isError () {
      return this.error
    },

    onDrop (e, targetNodeId) {
      this.setNodeActive(targetNodeId, false)
      this.$emit('onDrop', e, targetNodeId)
    },

    async getFile (assetId) {
      const data = await this.getAssetUrl(assetId)
      if (data) {
        this.fileViewer = {
          show: true,
          format: data.format,
          sources: [{ src: data.url, type: data.format === 'pdf' ? 'pdf' : 'video/mp4' }]
        }
      }
    }

  }
}
</script>
