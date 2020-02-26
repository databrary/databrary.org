<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-8">
      <div class="text-h4 q-mb-md">Profile</div>
      <q-input label="Name:" dense outlined />
      <q-input
        outlined
        dense
        label="Bio:"
        class="q-py-md"
      />
      <div class="text-right">
        <q-btn color="primary" label="save" />
      </div>
    </div>
    <div class="order-sm-first order-md-last col-xs-12 col-sm-12 col-md-4 q-pa-sm text-center">
      <div class="text-h5 q-my-sm">Profile picture</div>
      <q-avatar  size="100px">
        <img :src="gravatar">
      </q-avatar>
      <br>
      <div class="q-my-sm">
        <AvatarUploader/>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import AvatarUploader from '../Upload/UploadAvatar.vue'
export default {
  name: 'SettingsProfile',
  components: {
    AvatarUploader
  },
  computed: {
    gravatar: get('app/gravatar')
  }
}
</script>
