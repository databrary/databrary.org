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
      <q-spinner
        class="absolute-center"
        color="primary"
        size="3em"
      />
    </div>
    <div v-else>
      <q-tree
        ref="qtree"
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
            @drop="onDrop($event, prop.node)"
            @dragover.prevent
          >
            <!-- We should have only folders in the tree -->
            <q-icon :name="prop.expanded ? icons['folderOpen'] : icons['folder']" />
            <span class="q-ml-sm node-text">
              {{ prop.node.name }}
            </span>
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
    onDrop (e, newNode) {
      const oldNode = JSON.parse(e.dataTransfer.getData('node'))

      if (oldNode.id === newNode.id) return

      // don't drop on other draggables
      if (e.target.draggable === true) return

      const children = JSON.parse(e.dataTransfer.getData('children'))

      console.log('Children on drop', children)

      this.moveFile(children, oldNode, newNode)
    },
    moveFile (children, oldNode, newNode) {
      this.$emit('moveFile', children, oldNode, newNode)
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
