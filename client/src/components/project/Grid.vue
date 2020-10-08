<template>
    <div v-if="loading">
      <q-spinner-facebook
        class="absolute-center"
        color="primary"
      />
    </div>
    <div v-else class="contents-wrapper">
      <q-toolbar class="bg-white text-dark q-pa-sm">
        <q-toolbar-title class="text-bold"></q-toolbar-title>

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
      <div v-show="viewSelected === 'grid'" class="row justify-left">
        <div v-for="node in children" :key="node.id">
          <div class="item-container" :style="itemContainerStyleObject">
            <q-card
              flat
              :draggable="!node.isDir"
              @dragstart="!node.isDir ? onDragStart($event, selected, node.id) :  null"
              @drop="node.isDir ? onDrop($event, node.id) : null"
              @dragover.prevent
              @dblclick.prevent="node.isDir ? onDblClick($event, node.id, node.isDir) : null"
            >
              <q-card-section class="text-center" >
                <q-icon
                  size="xl"
                  :name="node.isDir ? icons['folder'] : icons[node.format.toLowerCase()] || icons['other']"
                />
              </q-card-section>
              <q-card-section >
                <div class="item-text" >{{ node.name }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <div class="col-12" v-show="viewSelected === 'list'">
        <q-table
          id="content"
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
        >
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
      this.$emit('selectedChildren', this.selectedChildren)
    }
  },
  computed: {
    tableStyleObj () {
      return {
        height: this.height + 'px'
      }
    },
    itemContainerStyleObject () {
      if (this.children.id === this.selected) {
        // current node is selected
        return {
          width: this.width + 'px'
        }
      } else {
        return {
          width: this.width + 'px'
        }
      }
    },
    itemTextStyleObject () {
      return {
        fontSize: this.fontSize + 'px'
      }
    },
    itemImageStyleObject () {
      return {
        width: this.width + 'px',
        height: this.width + 'px'
      }
    }
  },
  methods: {
    onDragStart (e, nodeId, childId) {
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('childId', childId)
      e.dataTransfer.setData('nodeId', nodeId)
    },
    onDrop (e, newNodeId) {
      const nodeId = e.dataTransfer.getData('nodeId')

      if (nodeId === newNodeId) return

      // don't drop on other draggables
      if (e.target.draggable === true) return

      const fileId = e.dataTransfer.getData('childId')

      this.moveFile(fileId, nodeId, newNodeId)
    },
    moveFile (fileId, nodeId, newNodeId) {
      this.$emit('moveFile', fileId, nodeId, newNodeId)
    },
    onDblClick (e, nodeId, isDir) {
      this.selected = nodeId

      this.$emit('dblClick', this.selected, isDir)
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

.item-container {
  margin: 5px;
  height: auto;
  word-wrap: break-word;
  border-radius: 4px;
  transition: 'all 0.5s ease-in-out';
}
.item-container:hover {
  background-color: rgba(0, 0, 0, .05);
  box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
  transition: 'all 0.5s ease-in-out';
  cursor: pointer
}
.item-text {
  text-align: center;
  word-wrap: break-word;
}
#content .q-table-container {
  position: relative;
  border-radius: 0 !important;
  box-shadow: inherit !important;
}
</style>
