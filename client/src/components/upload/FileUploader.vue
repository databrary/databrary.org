<template>
  <div>
    <div id="files-upload-area"></div>
  </div>
</template>

<script>
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import AwsS3 from '@uppy/aws-s3'

import { mapActions } from 'vuex'

require('@uppy/core/dist/style.css')
require('@uppy/dashboard/dist/style.css')
require('@uppy/webcam/dist/style.css')
require('@uppy/url/dist/style.css')

export default {
  name: 'FileUploader',
  props: {
    parentId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      uppy: ''
    }
  },
  methods: {
    ...mapActions('assets', ['insertAsset'])
  },
  mounted () {
    this.projectIdFromRoute = parseInt(this.$route.params.projectId) // String to integer
    const that = this
    // We need to create a file Asset for each uploaded file
    // And that file Asset will be linked to a folder
    // Important: the file asset must be deleted if the upload fails
    try {
      this.uppy = Uppy({
        id: 'FilesUploader'
      }).use(Dashboard, {
        inline: true,
        target: '#files-upload-area'
      }).use(AwsS3, {
        async getUploadParameters (file) {
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
              assetId: await that.insertAsset(
                {
                  name: file.name,
                  assetType: 'file',
                  privacyType: 'private',
                  parentId: this.parentId
                }
              ),
              uploadType: 'file'
            })
          }).then((response) => {
            console.log('response', response)
            return response.json()
          }).then((data) => {
            console.log('data', data)
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
    } catch (error) {

    }
  }
}
</script>
