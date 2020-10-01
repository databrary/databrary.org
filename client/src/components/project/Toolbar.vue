<template>
    <q-toolbar class="no-padding bg-white text-dark">
      <q-toolbar-title>Files</q-toolbar-title>
      <q-btn
        flat
        icon="cloud_download"
        color="primary"
        label="Download"
        :disable="selected.length === 0"
      >
        <q-tooltip>
          Download selected files
        </q-tooltip>
      </q-btn>

      <q-btn
        flat
        icon="cloud_upload"
        color="primary"
        label="Upload"
        @click="showFileUploadDialog"
      >
        <q-tooltip>
          Upload files or folders to your project
        </q-tooltip>
      </q-btn>
      <q-btn
        flat
        icon="folder"
        color="primary"
        label="Create Virtual Volume"
        @click="showVolumeDialog"
      >
        <q-tooltip>Create a new volume from selected data</q-tooltip>
      </q-btn>
    </q-toolbar>
</template>

<script>
export default {
  name: 'Toolbar',
  props: ['selected'],
  methods: {
    showFileUploadDialog () {
      this.$emit('showFileUploadDialog', true)
    },
    showVolumeDialog () {
      this.$emit('showVolumeDialog', true)
    }
  }
}
</script>
