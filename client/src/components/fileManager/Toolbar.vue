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
      @click.stop="$emit('update:showFileUploadDialog', true)"
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
      @click.stop="$emit('add-node')"
    >
      <q-tooltip>
        Add A New Folder
      </q-tooltip>
    </q-btn>
    <q-btn
      v-show="selectedContentsSize >= 1"
      flat
      dense
      icon="clear"
      label="Delete"
      color="primary"
      @click.stop="$emit('delete-node')"
    >
      <q-tooltip>
        Delete Selected Items
      </q-tooltip>
    </q-btn>
    <q-btn
      v-show="selectedContentsSize === 1"
      flat
      dense
      icon="edit"
      label="Edit"
      color="primary"
      @click.stop="$emit('edit-node')"
    >
      <q-tooltip>
        Rename Selected Item
      </q-tooltip>
    </q-btn>

    <q-space />
    <q-btn
      v-show="selectedContentsSize >= 1"
      flat
      dense
      icon="clear"
      label="Clear"
      color="primary"
      @click.stop="$emit('clear-selection')"
    >
      <q-tooltip>
        Clear Selection
      </q-tooltip>
    </q-btn>

    <q-btn-dropdown
      flat
      dense
      icon="search"
      color="primary"
    >
      <q-input
        dense
        v-model="filter"
        input-class="text-right"
      >
        <template v-slot:append>
          <q-icon v-if="filter === ''" name="search" />
          <q-icon v-else name="clear" class="cursor-pointer" @click="filter = ''" />
        </template>
      </q-input>
    </q-btn-dropdown>

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
    },
    selectedContentsSize: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    view: null,
    filter: ''
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
    },
    filter () {
      this.$emit('filter', this.filter)
    }
  }
}
</script>
