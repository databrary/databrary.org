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
              class="row items-center"
              @drop="onDrop($event, prop.node.id)"
              @dragover.prevent
            >
              <q-icon :name="prop.node.isDir ? icons['folder'] : icons['other']" />
              <div class="col-10">{{ prop.node.name }}</div>
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
      required: true
    },
    icons: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
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

      const childId = e.dataTransfer.getData('childId')

      this.moveFile(childId, nodeId, newNodeId)
    },
    moveFile (childId, nodeId, newNodeId) {
      this.$emit('moveFile', childId, nodeId, newNodeId)
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

</style>
