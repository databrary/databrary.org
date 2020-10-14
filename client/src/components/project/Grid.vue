<template>
    <div class="contents-wrapper">
      <q-toolbar class="bg-white text-dark q-pa-sm">
        <q-btn
          flat
          label="Upload"
          icon="cloud_upload"
          color="primary"
          @click.stop="onClickNodeUpload()"
        >
          <q-tooltip>
            Upload files
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
          :data="children"
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
            <q-td>
              <div
                :class="!props.row.isDir ? 'items-center cursor-pointer' : 'items-center'"
                :draggable="!props.row.isDir"
                @dragstart="!props.row.isDir ? onDragStart($event, props.row.id) :  null"
                @drop="props.row.isDir ? onDrop($event, props.row.id) : null"
                @dragover.prevent
                @dblclick.prevent="props.row.isDir ? onDblClick($event, props.row.id, props.row.isDir) : null"
              >
                <q-icon
                  class="col-2"
                  size="sm"
                  :name="props.row.isDir ? icons['folder'] : icons[props.row.format.toLowerCase()] || icons['other']"
                />
                <span class="col-10 q-ml-sm text-center">{{props.row.name}}</span>
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
              :draggable="!props.row.isDir"
              @dragstart="!props.row.isDir ? onDragStart($event, props.row.id) :  null"
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
    </div>
</template>

<script>
export default {
  name: 'Grid',
  props: {
    children: {
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
    }
  },
  data () {
    return {
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
      fontSize: 12
    }
  },
  mounted () {
    this.height = this.$parent.$el.offsetHeight - 50
    this.selected = this.selectedNode
  },
  watch: {
    selectedNode () {
      this.selected = this.selectedNode
    },
    selected () {
      this.$emit('selected', this.selected)
    },
    selectedChildren () {
      this.$emit('selectedFiles', this.selectedChildren)
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
    onDragStart (e, childId) {
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      // We move all selected files, if not, only the draged one
      let children = [childId]

      if (this.selectedChildren.length > 0) children = this.selectedChildren.map((child) => child.id)

      e.dataTransfer.setData('children', children)
      e.dataTransfer.setData('nodeId', this.selected)
    },
    onDrop (e, newNodeId) {
      const nodeId = e.dataTransfer.getData('nodeId')

      if (nodeId === newNodeId) return

      // don't drop on other draggables
      if (e.target.draggable === true) return

      const children = e.dataTransfer.getData('children').split(',')

      children.every((childId) => {
        this.moveFile(childId, nodeId, newNodeId)
      })
    },
    moveFile (fileId, nodeId, newNodeId) {
      this.$emit('moveFile', fileId, nodeId, newNodeId)
    },
    onDblClick (e, nodeId, isDir) {
      this.selected = nodeId

      this.$emit('dblClick', this.selected, isDir)
    },
    onClickNodeUpload () {
      this.$emit('showFileUploadDialog', true, this.selected)
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
