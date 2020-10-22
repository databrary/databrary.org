<template>
  <div class="col-12">
    <div class="row">
      <q-list class="col-12">
        <q-item
          @click="selected = root"
          :active="isRootActive"
          clickable
          v-ripple
          active-class="row bg-teal-1 text-grey-8"
          @drop="onDrop($event, rootNode)"
          @dragenter.prevent="isRootActive = true"
          @dragleave.prevent="isRootActive = false"
          @dragover.prevent="isRootActive = true"
        >
          <q-item-section avatar>
            <q-icon color="primary" name="folder" />
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">Files</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div v-if="loading">
      <q-spinner
        class="absolute-center"
        color="primary"
        size="3em"
      />
    </div>
    <div v-else class="row">
      <q-tree
        ref="qtree"
        class="col-12"
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
            @dragenter="$event.currentTarget.style.background = '#8fcba6'"
            @dragleave="$event.currentTarget.style.background = ''"
            @dragover.prevent
          >
            <!-- We should have only folders in the tree -->
            <q-icon
              :name="prop.expanded || prop.node.id === selected ? icons['folderOpen'] : icons['folder']"
            />
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
    rootNode: {
      type: String,
      requried: true,
      default: () => null
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
      root: '', // The id of the root folder, could be pam | project
      selected: '', // The id of the selected node,
      isRootActive: false
    }
  },
  mounted () {
    this.selected = this.selectedNode
    this.root = this.rootNode
  },
  watch: {
    // this comes from the parent
    selectedNode () {
      if (this.selected === this.selectedNode) return

      this.selected = this.selectedNode
    },
    rootNode () {
      this.root = this.rootNode
    },
    selected () {
      this.isRootActive = this.selected === this.rootNode
      this.$emit('selected', this.selected)
    }
  },
  methods: {
    onDrop (e, targetNodeId) {
      e.currentTarget.style.background = ''
      const sourceNode = JSON.parse(e.dataTransfer.getData('node'))

      if (sourceNode.id === targetNodeId) return

      // don't drop on other draggables
      if (e.target.draggable === true) return

      const children = JSON.parse(e.dataTransfer.getData('children'))

      this.moveNode(children, targetNodeId)
    },
    moveNode (children, targetNodeId) {
      this.$emit('moveNode', children, targetNodeId)
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
