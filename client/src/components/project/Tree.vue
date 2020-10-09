<template>
  <div class="row tree-wrapper">
    <!-- <q-input
      class="col-12"
      ref="filter"
      dense
      outlined
      v-model="filter"
      label="Filter"
    >
      <template v-slot:append>
        <q-icon
          v-if="filter !== ''"
          name="clear"
          class="cursor-pointer"
          @click="resetFilter"
        />
        <q-icon name="search" />
      </template>
    </q-input> -->
    <div v-if="loading">
      <q-spinner-facebook
        class="absolute-center"
        color="primary"
        size="4em"
      />
    </div>
    <div v-else>
      <q-tree
        class="col-12"
        :nodes="nodes"
        node-key="id"
        selected-color="primary"
        :filter="filter"
        :selected.sync="selected"
        @lazy-load="lazyLoad"
      >
        <template v-slot:default-header="prop">
          <div
            class="row inline items-center"
            @drop="onDrop($event, prop.node.id)"
            @dragover.prevent
          >
            <q-icon :name="prop.node.isDir ? icons['folder'] : icons['other']" />
            <span class="q-ml-sm node-text">{{ prop.node.name }}</span>
          </div>
        </template>
      </q-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tree',
  props: {
    nodes: {
      type: Array,
      required: true
    },
    selectedNode: {
      type: String,
      required: false
    },
    lazyLoad: {
      type: Function,
      required: true,
      default: () => null
    },
    icons: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: true,
      default: () => false
    }
  },
  data () {
    return {
      selected: '',
      filter: ''
    }
  },
  mounted () {
    this.selected = this.selectedNode
  },
  watch: {
    // this comes from the parent
    selectedNode () {
      this.selected = this.selectedNode
    },
    selected () {
      this.$emit('selected', this.selected)
    }
  },
  methods: {
    onDrop (e, newNodeId) {
      const nodeId = e.dataTransfer.getData('nodeId')

      if (nodeId === newNodeId) return

      // don't drop on other draggables
      if (e.target.draggable === true) return

      const children = e.dataTransfer.getData('children').split(',')

      this.moveFile(children, nodeId, newNodeId)
    },
    moveFile (children, nodeId, newNodeId) {
      this.$emit('moveFile', children, nodeId, newNodeId)
    },
    resetFilter () {
      this.filter = ''
      this.$refs.filter.focus()
    }
  }
}
</script>
<style scoped>
.tree-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.node-text {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
</style>
