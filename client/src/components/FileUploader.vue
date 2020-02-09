<template>
  <div id="drag-drop-area"></div>
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
  name: 'FileUploader',
  data: function data () {
    return {
      uppy: ''
    }
  },
  mounted: function mounted () {
    this.projectIdFromRoute = this.$route.params.projectId
    const that = this
    this.uppy = Uppy()
      .use(Dashboard, {
        inline: true,
        target: '#drag-drop-area'
      })
      .use(AwsS3, {
        getUploadParameters (file) {
          return fetch('/sign-upload', {
            method: 'post',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type,
              format: file.extension,
              projectId: that.projectIdFromRoute
            })
          }).then((response) => {
            // console.log('response', response)
            return response.json()
          }).then((data) => {
            // console.log('data', data)
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
