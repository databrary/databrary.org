<template>
  <div id="avatar-upload-area"></div>
</template>

<script>
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import Webcam from '@uppy/webcam'
import AwsS3 from '@uppy/aws-s3'
import { gql } from '@apollo/client'
import { sync, get, call } from 'vuex-pathify'
import { assertType } from 'graphql'

require('@uppy/core/dist/style.css')
require('@uppy/dashboard/dist/style.css')
require('@uppy/webcam/dist/style.css')
require('@uppy/url/dist/style.css')

export default {
  name: 'ImageUploader',
  props: ['assetType', 'assetName', 'uploadType'],
  data () {
    return {
      uppy: ''
    }
  },
  computed: {
    userId: get('app/dbId'),
    avatar: sync('app/avatar')
  },
  methods: {
    insertAsset: call('assets/insertAsset')
  },
  mounted: function mounted () {
    const that = this

    this.uppy = Uppy({
      id: 'ImageUploader',
      allowMultipleUploads: true, // FIXME(Reda): Allow only one upload and clear cached upload
      restrictions: {
        minNumberOfFiles: 1,
        allowedFileTypes: ['images/*', '.jpg', '.jpeg', '.png', '.gif']
      }
    }).use(Webcam, {
      modes: [
        'picture'
      ],
      facingMode: 'user',
      strings: {
        // Shown in the main dashboard area when no files have been selected, and one or more
        // remote provider plugins are in use. %{browse} is replaced with a link that opens the system
        // file selection dialog.
        dropPasteImport: 'Drop your picture here, paste, %{browse} or import from'
      }
    }).use(Dashboard, {
      inline: false,
      target: '#avatar-upload-area',
      trigger: '.avatar-uploader',
      closeModalOnClickOutside: true,
      showLinkToFileUploadResult: false,
      plugins: ['Webcam']
    }).use(AwsS3, {
      async getUploadParameters (file) {
        return fetch('/minio/sign-upload', {
          method: 'post',
          credentials: 'same-origin',
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
                name: that.assetName,
                assetType: that.assetType,
                privacyType: 'public'
              }
            ),
            uploadType: that.uploadType || that.assetType
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
          console.log(`Uppy error ${error}`)
        })
      }
    }).on('upload-success', (file, data) => {
      if (that.uploadType === 'avatar') {
        const oldAvatar = this.avatar
        this.$q.loading.show({
          message: 'Upload is in progress.<br/><span class="text-primary">Hang on...</span>'
        })
        const refreshSession = setInterval(async () => {
          await this.$store.dispatch('app/syncSessionAsync')
          if (oldAvatar !== this.avatar) {
            this.$q.loading.hide()
            clearInterval(refreshSession)
          }
        }, 500)
      }
    })
  }
}
</script>
