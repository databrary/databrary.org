<template>
    <div class="contents-wrapper">
      <q-toolbar class="bg-white text-dark q-pa-sm">
        <q-btn
          flat
          icon="chevron_left"
          color="primary"
          :disable="goBackDisabled"
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
                :class="'items-center cursor-pointer'"
                draggable
                @dragstart="onDragStart($event, props.row)"
                @drop="props.row.isDir ? onDrop($event, props.row) : null"
                @dragover.prevent
                @dblclick.prevent="props.row.isDir ? onDblClick($event, props.row) : null"
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
              draggable
              @dragstart="onDragStart($event, props.row.id)"
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
    },
    goBackDisabled: {
      type: Boolean,
      required: false,
      default: () => false
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
      this.$emit('selectedChildren', this.selectedChildren)
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
    onDragStart (e, node) {
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      // We move all selected files, if not, only the draged one
      let children = [node]

      if (this.selectedChildren.length > 0) children = this.selectedChildren

      e.dataTransfer.setData('children', JSON.stringify(children))
      e.dataTransfer.setData('node', JSON.stringify(node))
    },
    onDrop (e, newNode) {
      const oldNode = JSON.parse(e.dataTransfer.getData('node'))

      if (oldNode.id === newNode.id) return

      // don't drop on other draggables
      if (e.target.draggable === true) return

      const children = JSON.parse(e.dataTransfer.getData('children'))

      this.moveFile(children, oldNode, newNode)
    },
    moveFile (children, oldNode, newNode) {
      this.$emit('moveFile', children, oldNode, newNode)
    },
    onDblClick (e, node) {
      this.$emit('dblClick', node)
    },
    onClickUpload () {
      this.$emit('showFileUploadDialog', true)
    },
    onClickBack () {
      this.$emit('goBack')
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
