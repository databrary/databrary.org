<template>
  <div>
    <div id="files-upload-area"></div>
  </div>
</template>

<script>
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'

import GoogleDrive from '@uppy/google-drive'
import Dropbox from '@uppy/dropbox'
import Instagram from '@uppy/instagram'
import Facebook from '@uppy/facebook'
import OneDrive from '@uppy/onedrive'
import Webcam from '@uppy/webcam'
import ScreenCapture from '@uppy/screen-capture'
import AwsS3 from '@uppy/aws-s3'

import { call } from 'vuex-pathify'

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
      uppy: '',
      newAssetId: null
    }
  },
  methods: {
    insertAsset: call('assets/insertAsset'),
    addUpload: call('uploads/addUpload'),
    updateUpload: call('uploads/updateUpload')
  },
  mounted () {
    this.projectIdFromRoute = parseInt(this.$route.params.projectId) // String to integer
    const that = this
    // We need to create a file Asset for each uploaded file
    // And that file Asset will be linked to a folder
    // Important: the file asset must be deleted if the upload fails
    this.uppy = Uppy({
      id: 'FilesUploader'
    }).use(Dashboard, {
      inline: true,
      target: '#files-upload-area'
    }).use(GoogleDrive, { inline: true, target: Dashboard, companionUrl: 'https://companion.uppy.io'
    }).use(Dropbox, { inline: true, target: Dashboard, companionUrl: 'https://companion.uppy.io'
    }).use(Instagram, { inline: true, target: Dashboard, companionUrl: 'https://companion.uppy.io'
    }).use(Facebook, { inline: true, target: Dashboard, companionUrl: 'https://companion.uppy.io'
    }).use(OneDrive, { inline: true, target: Dashboard, companionUrl: 'https://companion.uppy.io'
    }).use(Webcam, { inline: true, target: Dashboard, companionUrl: 'https://companion.uppy.io'
    }).use(ScreenCapture, { inline: true, target: Dashboard, companionUrl: 'https://companion.uppy.io'
    }).use(AwsS3, {
      async getUploadParameters (file) {
        const { id } = await that.insertAsset(
          {
            name: file.name,
            assetType: 'file',
            privacyType: 'private',
            parentId: that.parentId
          }
        )
        that.newAssetId = id
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
            assetId: that.newAssetId,
            uploadType: 'file'
          })
        }).then((response) => {
          return response.json()
        }).then((data) => {
          return {
            method: data.method,
            url: data.url,
            fields: data.fields,
            headers: data.headers
          }
        }).catch((error) => {
          throw new Error(`Uppy:: ${error.message}`)
        })
      }
    }).on('file-added', (file) => {
      const newUpload = {
        id: file.id,
        name: file.name,
        bytesUploaded: 0,
        bytesTotal: file.size,
        completed: false
      }
      this.addUpload(newUpload)
    }).on('upload-progress', (file, progress) => {
      const body = {
        bytesUploaded: progress.bytesUploaded
      }
      this.updateUpload({ id: file.id, body: body })
    }).on('upload-success', (file, response) => {
      this.updateUpload({ id: file.id, body: { completed: true } })
    })
  }
}
</script>
