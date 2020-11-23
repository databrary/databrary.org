<template>
    <q-card no-margin n-padding flat class="row">
        <q-card-section class="col-12">
          <span>{{file.name}}</span>
          <q-linear-progress class="q-my-sm" size="10px" :value="progress / 100" />
          <span>Progress: {{Math.floor(progress)}}%</span>
        </q-card-section>
    </q-card>
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
