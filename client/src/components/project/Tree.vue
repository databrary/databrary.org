<template>
    <q-tree
        :nodes="nodes"
        node-key="id"
        selected-color="primary"
        :selected.sync="selected"
        @lazy-load="lazyLoad"
    >
        <template v-slot:default-header="prop">
            <div
                class="row items-center"
                @drop="onDrop($event, prop.node.id)"
                @dragover.prevent
            >
                <q-icon :name="prop.node.icon" />
                <div>{{ prop.node.name }}</div>
            </div>
        </template>
    </q-tree>
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
    }
  },
  data () {
    return {
      selected: ''
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
    }
  }
}
</script>
