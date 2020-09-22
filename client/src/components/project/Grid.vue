<template>
    <div>
        <q-toolbar class="bg-white text-dark q-px-sm">
        <q-toolbar-title class="text-bold">{{selectedFolder}}</q-toolbar-title>

        <q-btn-toggle
          v-model="viewSelected"
          push
          dense
          toggle-color="primary"
          :options="viewOptions"
        >
          <template v-slot:grid>
            <div class="row items-center no-wrap">
              <q-icon name="view_module" />
            </div>
          </template>

          <template v-slot:list>
            <div class="row items-center no-wrap">
              <q-icon name="format_list_bulleted" />
            </div>
          </template>
        </q-btn-toggle>
      </q-toolbar>
      <q-tab-panels
        v-model="selectedFolder"
        animated
        transition-prev="jump-up"
        transition-next="jump-up"
        v-for="ele in data"
        :key="ele.id"
      >
        <q-tab-panel
          :name="ele.label"
        >
          <div v-if="ele.isDir">
            <q-table
              :grid="viewSelected == 'grid'"
              :data="ele.children ? ele.children : []"
              :columns="columns"
              row-key="label"
              selection="multiple"
              style="height: 350px"
              virtual-scroll
              :pagination.sync="pagination"
              :rows-per-page-options="[0]"
              flat
              :selected.sync="selectedFiles"
            >
              <template v-if="gridView" v-slot:item="props">
                <div
                  class="col-xs-12 col-sm-6 col-md-4"
                  draggable
                  @dragstart='onDragStart($event, ele.id, props.row.id)'
                  @dragover.prevent
                >
                  <q-card flat>
                    <q-card-section class="text-center" >
                      <q-icon size="xl" :name="icons[props.row.format.toLowerCase()] || icons['other']"/>
                    </q-card-section>
                    <q-card-section  class="text-center">
                      <div>{{ props.row.label }}</div>
                    </q-card-section>
                  </q-card>
                </div>
              </template>
            </q-table>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
</template>

<script>
export default {
  name: 'Grid',
  props: ['data', 'icons', 'folder', 'columns'],
  data () {
    return {
      selectedFiles: [],
      selectedFolder: '',
      gridView: true,
      viewSelected: 'grid',
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
    this.selectedFolder = this.folder
  },
  watch: {
    folder () {
      this.selectedFolder = this.folder
    },
    selectedFiles () {
      this.$emit('selectedFiles', this.selectedFiles)
    }
  },
  methods: {
    onDragStart (e, folderId, fileId) {
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('fileId', fileId)
      e.dataTransfer.setData('folderId', folderId)
    }
  }
}
</script>
