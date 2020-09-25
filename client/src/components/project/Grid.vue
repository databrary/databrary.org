<template>
    <div v-if="!data">
      <q-spinner-dots
        class="absolute-center"
        color="primary"
        size="4em"
      />
    </div>
    <div v-else>
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
      <q-table
        flat
        :grid="viewSelected === 'grid'"
        :data="data"
        :columns="columns"
        row-key="id"
        selection="multiple"
        style="height: 350px"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        :selected.sync="selectedFiles"
      >
        <template v-if="viewSelected == 'grid'" v-slot:item="props">
          <div
            class="non-selectable col-xs-12 col-sm-6 col-md-4"
            :draggable="!props.row.isDir"
            @dragstart="!props.row.isDir ? onDragStart($event, selected, props.row.id) :  null"
            @drop="props.row.isDir ? onDrop($event, props.row.id) : null"
            @dragover.prevent
            @dblclick.prevent="props.row.isDir ? onDblClick($event, props.row.id, props.row.isDir) : null"
          >
            <q-card flat>
              <q-card-section class="text-center" >
                <q-icon
                  size="xl"
                  :name="props.row.isDir ? icons['folder'] : icons[props.row.format.toLowerCase()] || icons['other']"
                />
              </q-card-section>
              <q-card-section  class="text-center">
                <div>{{ props.row.name }}</div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
</template>

<script>
// import GridItem from './GridItem'

export default {
  name: 'Grid',
  props: ['data', 'icons', 'selectedFolder', 'columns'],
  components: {
    // GridItem
  },
  data () {
    return {
      selectedFiles: [],
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
      }
    }
  },
  mounted () {
    this.selected = this.selectedFolder
  },
  watch: {
    selectedFolder () {
      this.selected = this.selectedFolder
    },
    selected () {
      this.$emit('selected', this.selected)
    },
    selectedFiles () {
      this.$emit('selectedFiles', this.selected)
    }
  },
  methods: {
    onDragStart (e, folderId, fileId) {
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('fileId', fileId)
      e.dataTransfer.setData('folderId', folderId)
    },
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
    },
    onDblClick (e, folderId, isDir) {
      this.selected = folderId

      this.$emit('dblClick', this.selectedFolder, isDir)
    }
  }
}
</script>
