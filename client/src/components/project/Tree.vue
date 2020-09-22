<template>
    <q-tree
        :nodes="data"
        node-key="label"
        selected-color="primary"
        :selected.sync="selected"
    >
        <template v-slot:default-header="prop">
            <div
                class="row items-center"
                @drop="onDrop($event, prop.node.id)"
                @dragover.prevent
            >
                <q-icon :name="prop.node.icon" />
                <div>{{ prop.node.label }}</div>
            </div>
        </template>
    </q-tree>
</template>

<script>
export default {
  name: 'Tree',
  props: ['data', 'folder'],
  data () {
    return {
      selected: ''
    }
  },
  mounted () {
    this.selected = this.folder
  },
  watch: {
    // this comes from the parent
    folder () {
      this.selected = this.folder
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
