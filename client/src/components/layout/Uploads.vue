<template>
    <q-btn
      clickable
      dense
      flat
      icon="update"
      class="text-weight-light text-grey-8"
    >
      <q-menu>
        <q-list style="width: 300px">
          <q-item
            v-if="uploads.length === 0"
            class="text-black"
            v-close-popup
          >
            <q-item-section>
              <span>No Uploads</span>
            </q-item-section>
          </q-item>
          <q-item
            v-else
            class="text-black"
            v-for="upload in uploads"
            :key="upload.id"
            v-close-popup
          >
            <q-item-section>
              <UploadStatus :upload="upload"/>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
</template>

<script>
import UploadStatus from './UploadStatus.vue'
import { get } from 'vuex-pathify'

export default {
  components: {
    UploadStatus
  },
  data: () => ({
    timeout: null
  }),
  computed: {
    uploads: get('uploads/uploads')
  }
}
</script>
