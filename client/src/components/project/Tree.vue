<template>
    <q-tree
        :nodes="data"
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
    data: {
      type: Array,
      required: true
    },
    selectedFolder: {
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
    this.selected = this.selectedFolder
  },
  watch: {
    // this comes from the parent
    selectedFolder () {
      this.selected = this.selectedFolder
    },

    selected () {
      this.$emit('selected', this.selected)
    }
  },
  methods: {
    onDrop (e, newFolderId) {
      const folderId = e.dataTransfer.getData('folderId')

      if (folderId === newFolderId) return

      // don't drop on other draggables
      if (e.target.draggable === true) return

      const fileId = e.dataTransfer.getData('fileId')

      this.moveFile(fileId, folderId, newFolderId)
    },
    moveFile (fileId, folderId, newFolderId) {
      this.$emit('moveFile', fileId, folderId, newFolderId)
    }
  }
}
</script>
