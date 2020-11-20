<template>
    <div class="row">
        <span class="col-12">{{file.name}}</span>
        <q-linear-progress size="10px" :value="progress / 100" />
        <span class="col-6">Progress: {{Math.floor(progress)}}%</span>
        <span v-if="file.completed" class="col-6">Completed</span>
    </div>
</template>

<script>
import StatusBar from '@uppy/status-bar'

require('@uppy/core/dist/style.css')

export default {
  name: 'UploadStatus',
  props: {
    upload: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    file: null
  }),
  created () {
    this.file = this.upload
  },
  computed: {
    progress () {
      return (this.file.bytesUploaded / this.file.bytesTotal) * 100
    }
  },
  watch: {
    upload () {
      this.file = this.upload
      console.log('FIle', this.file)
    }
  }
}
</script>
