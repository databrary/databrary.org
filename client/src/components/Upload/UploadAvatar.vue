<template>
  <div>
    <div id="avatar-upload-area"></div>
    <q-btn
        flat
        class="avatar-uploader q-my-sm"
        color="primary"
        label="Change profile picture"
      />

      <q-toggle
        v-model="useGravatar"
        color="primary"
        label="Use Gravatar"
      />
  </div>
</template>

<script>
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import Webcam from '@uppy/webcam'
import AwsS3 from '@uppy/aws-s3'
import { get } from 'vuex-pathify'

require('@uppy/core/dist/style.css')
require('@uppy/dashboard/dist/style.css')
require('@uppy/webcam/dist/style.css')
require('@uppy/url/dist/style.css')

export default {
  name: 'AvatarUploader',
  data: function data () {
    return {
      uppy: '',
      oldAvatar: '',
      useGravatar: true
    }
  },
  computed: {
    avatar: get('app/avatar')
  },
  mounted: function mounted () {
    this.uppy = Uppy({
      id: 'AvatarUploader',
      allowMultipleUploads: false,
      restrictions: {
        maxNumberOfFiles: 1,
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
      plugins: ['Webcam']
    }).use(AwsS3, {
      getUploadParameters (file) {
        return fetch('/sign-upload', {
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
            uploadType: 'avatar'
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
    }).on('dashboard:modal-closed', () => {
      this.oldAvatar = this.avatar
      const refreshSession = setInterval(async () => {
        await this.$store.dispatch('app/syncSessionAsync')
        if (this.oldAvatar !== this.avatar) {
          clearInterval(refreshSession)
        }
      }, 100)
    })
  },
  methods: {
    async refreshGravatar () {
      // const result = await this.$apollo.mutate({
      //   mutation: gql`
      //     mutation updateUserGravar ($useGravatar: boolean) {
      //       assets(
      //         where: {asset_type: {_eq: project}, _and: {created_by_id: {_eq: $userId}}}
      //         order_by: {datetime_created: desc}
      //       ) {
      //         id
      //         name
      //         datetime_created
      //       }
      //     }
      //   `,
      //   variables: {
      //     userId: this.userId
      //   }
      // })

      const refreshSession = setInterval(async () => {
        await this.$store.dispatch('app/syncSessionAsync')
        if (this.oldAvatar !== this.avatar) {
          clearInterval(refreshSession)
        }
      }, 100)
    }
  }
}
</script>
