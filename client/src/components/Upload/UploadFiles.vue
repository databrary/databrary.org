<template>
  <div>
    <div id="files-upload-area"></div>
  </div>
</template>

<script>
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import AwsS3 from '@uppy/aws-s3'

require('@uppy/core/dist/style.css')
require('@uppy/dashboard/dist/style.css')
require('@uppy/webcam/dist/style.css')
require('@uppy/url/dist/style.css')

export default {
  name: 'FilesUploader',
  data: function data () {
    return {
      uppy: ''
    }
  },
  mounted: function mounted () {
    this.projectIdFromRoute = parseInt(this.$route.params.projectId) // String to integer
    const that = this
    this.uppy = Uppy({
      id: 'FilesUploader'
    }).use(Dashboard, {
      inline: true,
      target: '#files-upload-area'
    }).use(AwsS3, {
      getUploadParameters (file) {
        return fetch('/minio/sign-upload', {
          method: 'post',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            format: file.extension,
            assetId: that.projectIdFromRoute,
            uploadType: 'file'
          })
        }).then((response) => {
          console.log('response', JSON.stringify(response))
          return response.json()
        }).then((data) => {
          console.log('data', JSON.stringify(data))
          return {
            method: data.method,
            url: data.url,
            fields: data.fields,
            headers: data.headers
          }
        }).catch((error) => {
          console.log(`Uppy error ${error}`)
        })
      }
    })
  }
}
</script>
