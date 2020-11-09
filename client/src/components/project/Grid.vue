<template>
  <div ref="contentsRef" class="col-12">
    <div class="col-12">
      <q-table
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
        <template v-slot:body-cell-action>
          <q-td class="col-12">
            <div class="row-inline items-center justify-start">
              <q-btn class="col-6" flat dense icon="edit">
                <q-tooltip>
                  Rename
                </q-tooltip>
              </q-btn>
              <q-btn class="col-6" flat dense icon="clear">
                <q-tooltip>
                  Delete
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
        <!-- List view: custom name column -->
        <template v-slot:body-cell-name="props">
          <q-td class="col-12">
            <div
              :ref="props.row.id"
              class="row-inline justify-start items-center cursor-pointer"
              draggable
              @dragstart="onDragStart($event, props.row)"
              @dragend="$event.currentTarget.style.opacity = ''"
              @dragenter.prevent="props.row.isDir ? setNodeActive($event, props.row.id, true): null"
              @dragover.prevent="props.row.isDir ? setNodeActive($event,props.row.id, true): null"
              @dragleave.prevent="props.row.isDir ? setNodeActive($event,props.row.id, false) : null"
              @drop="props.row.isDir ? onDrop($event, props.row.id) : null"
              @dblclick.prevent="props.row.isDir ? selected = props.row.id : getFile(props.row.id)"
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
                v-model="props.row.id"
                @show="lastRef = props.row.id"
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
            @dblclick.prevent="props.row.isDir ? selected = props.row.id : getFile(props.row.id)"
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
      selected: '',
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
      lastRef: null,
      view: null,
      fileViewer: {
        show: false,
        format: null,
        sources: null
      }
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
    setNodeActive (e, ref, isActive) {
      if (ref === this.selected) return

      if (isActive) this.$refs[ref].classList.add('bg-teal-1', 'text-grey-8')
      else this.$refs[ref].classList.remove('bg-teal-1', 'text-grey-8')
    },
    showPopupEdit (ref = this.lastRef, ms = 300) {
      setTimeout(() => {
        const popEditRef = `${ref}-edit`
        if (this.$refs[popEditRef]) this.$refs[popEditRef].show()
      }, ms)
    },
    onDragStart (e, node) {
      e.currentTarget.style.opacity = this.opacityOnDragged

      // We move all selected files, if not, only the draged one
      let children = this.selectedChildren.length > 0
        ? this.selectedChildren
        : [node]

      this.$emit('onDragStart', e, node, children)
    },
    onDrop (e, targetNodeId) {
      this.setNodeActive(targetNodeId, false)
      this.$emit('onDrop', e, targetNodeId)
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
        canEdit: true,
        initialName: `${this.defaultName} ${this.newFolderCount}`
      }

      this.nodes.unshift(newNode)

      this.newFolderCount++
      // Wait for Quasar to update the table to show the popup edit
      this.showPopupEdit(newNode.id)
    },
    saveNode (node, name, initialName) {
      this.$emit('addNode', node, name, initialName)
    },
    hideNode (node, currentName) {
      this.saveNode(node, node.name, node.initialName)
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
