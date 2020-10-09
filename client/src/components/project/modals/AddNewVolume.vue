<template>
    <q-card class="bg-white text-dark">
        <q-bar>
        <div class="text-h5">Create New Folder</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
        </q-btn>
        </q-bar>

        <q-card-section>
        <div class="row">
          <div class="col-sm-5 col-md-5 col-lg-5 col-xl-5">
            <h6 class="no-margin">Shared Data</h6>
            <q-input
                ref="filter"
                dense
                v-model="filter"
                label="Filter"
                class="q-px-md"
            >
                <template v-slot:append>
                <q-icon
                  v-if="filter !== ''"
                  name="clear"
                  class="cursor-pointer"
                  @click="resetFilter"
                />
                </template>
            </q-input>
            <q-tree
              :nodes="nodes[0].children"
              node-key="id"
              tick-strategy="leaf"
              :ticked.sync="ticked"
              :filter="filter"
            >
              <template v-slot:default-header="prop">
                <div
                  class="row items-center"
                >
                  <q-icon :name="prop.node.isDir ? icons['folder'] : icons['other']" />
                  <span class="q-ml-sm node-text">
                    {{ prop.node.name }}
                  </span>
                </div>
              </template>
            </q-tree>
          </div>
          <div
            class="col-sm-2 col-md-2 col-lg-2 col-xl-2 self-center text-center q-px-sm"
           >
            <q-icon size="24px" name="arrow_forward" />
            <div>Select files on the left to create a new folder</div>
            <q-icon size="24px" name="arrow_forward" />
            </div>
            <div class="col-sm-5 col-md-5 col-lg-5 col-xl-5">
            <h6 class="no-margin">New Folder</h6>
            <q-input v-model="newFolderName" dense />
            <q-tree
              :nodes="newFolderChildren"
              node-key="label"
              default-expand-all
            />
          </div>
        </div>
        <div class="row justify-end">
            <q-btn
              type="submit"
              @click="createFolder"
              label="Create Volume"
              class="q-mt-md"
              color="teal"
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
        </div>
        </q-card-section>
    </q-card>
</template>

<script>
export default {
  props: ['nodes', 'volumesDialog', 'icons'],
  data () {
    return {
      ticked: [],
      newFolderName: 'New Volume',
      filter: '',
      newFolderChildren: []
    }
  },
  watch: {
    ticked () {
      this.newFolderChildren = []
      this.ticked.forEach((checkedEle) => {
        this.newFolderChildren.push({
          label: checkedEle,
          icon: 'insert_drive_file'
        })
      })
    }
  },
  methods: {
    resetFilter () {
      this.filter = ''
      this.$refs.filter.focus()
    },
    createFolder () {
      const newVolume = {
        label: this.newFolderName,
        icon: 'folder',
        children: this.newFolderChildren
      }
      // this.data.push(newVolume)
      this.$emit('input', this.nodes[0].children.push(newVolume))
      this.$emit('addFolder', newVolume)
      this.ticked = []
      this.$emit('update:volumesDialog', false)
    }
  }
}
</script>
