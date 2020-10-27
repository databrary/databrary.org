<template>
  <div class="col-12">
    <div class="row">
      <q-list class="col-12">
        <q-item
          @click="selected = root"
          :active="isRootActive"
          clickable
          v-ripple
          class="row"
          active-class="bg-teal-1 text-grey-8"
          @drop="onDrop($event, root)"
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
    <div v-if="loading" class="row">
      <q-spinner
        class="absolute-center"
        color="primary"
        size="3em"
      />
    </div>
    <q-scroll-area
      v-else
      :style="height ? {height: height+'px'} : {}"
      class="row q-mt-sm"
    >
      <q-tree
        class="col-12 full-height overflow-auto"
        ref="qtree"
        :nodes="nodes"
        node-key="id"
        selected-color="primary"
        :selected.sync="selected"
        @lazy-load="lazyLoad"
      >
        <template v-slot:default-header="prop">
          <div
            :ref="prop.node.id"
            class="row-inline ellipsis"
            @drop="onDrop($event, prop.node.id)"
            @dragenter.prevent="setNodeActive(prop.node.id, true)"
            @dragover.prevent="setNodeActive(prop.node.id, true)"
            @dragleave.prevent="setNodeActive(prop.node.id, false)"
          >
            <!-- We should have only folders in the tree -->
            <q-icon
              class="col-2"
              :name="prop.expanded || prop.node.id === selected ? icons['folderOpen'] : icons['folder']"
            />
            <span class="q-ml-sm col-10">
              {{ prop.node.name }}
            </span>
          </div>
        </template>
      </q-tree>
    </q-scroll-area>
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
    },
    height: {
      type: Number,
      default: () => this.$q.screen.height - 50 - 16 - 50 - 55
    }
  },
  data () {
    return {
      root: '', // The id of the root folder, could be pam | project
      selected: '', // The id of the selected node,
      isRootActive: false
    }
  },
  created () {
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
    setNodeActive (ref, isActive) {
      if (!this.$refs[ref] || ref === this.selected) return

      if (isActive) this.$refs[ref].classList.add('bg-teal-1', 'text-grey-8')
      else this.$refs[ref].classList.remove('bg-teal-1', 'text-grey-8')
    },
    onDrop (e, targetNodeId) {
      this.setNodeActive(targetNodeId, false)
      this.$emit('onDrop', e, targetNodeId)
    }
  }
}
</script>
