<template>
  <q-toolbar class="row bg-white text-dark q-pa-sm">
    <q-btn
      flat
      icon="subdirectory_arrow_left"
      class="rotate-90"
      color="primary"
      :disable="isRootNode"
      @click.stop="$emit('go-back')"
    >
      <q-tooltip>
        Go Back
      </q-tooltip>
    </q-btn>
    <q-btn
      flat
      label="Upload"
      icon="cloud_upload"
      color="primary"
      @click.stop="showFileUploadDialog = true"
    >
      <q-tooltip>
        Upload files
      </q-tooltip>
    </q-btn>

    <q-btn
      flat
      label="Add folder"
      icon="create_new_folder"
      color="primary"
      @click.stop="onAddNode()"
    >
      <q-tooltip>
        Add A New Folder
      </q-tooltip>
    </q-btn>
    <q-space />
    <q-btn-toggle
      flat
      v-model="view"
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
</template>

<script>
export default {
  name: 'Toolbar',
  props: {
    isRootNode: {
      type: Boolean,
      required: true
    },
    selectedView: {
      type: String,
      required: true
    },
    viewOptions: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    view: null
  }),
  mounted () {
    this.view = this.selectedView
  },
  watch: {
    selectedNode () {
      this.selected = this.selectedNode
    },
    view () {
      this.$emit('update:selectedView', this.view)
    }
  }
}
</script>
