<template>
    <q-btn
      clickable
      dense
      flat
      class="text-weight-light text-grey-8"
    >
      <q-icon
        name="update"
        @mouseover="onDragover($event)"
        @mouseout="onLeave($event)"
        @dragover.prevent="onDragover($event)"
        @dragLeave.prevent="onLeave($event)"
        @dragenter.prevent
      />
      <q-menu v-model="show">
        <q-list
          style="min-width: 200px"
          @dragover.prevent="onDragover($event)"
          @dragleave.prevent="onLeave($event)"
          @dragenter.prevent
        >
          <q-item
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
    show: false,
    timeout: null
  }),
  computed: {
    uploads: get('uploads/uploads')
  },
  methods: {
    onDragover (e) {
      if (this.timeout) {
        clearTimeout(this.menuTimeout)
      }
      if (!this.show) {
        this.show = true
      }
    },
    onLeave (e) {
      this.timeout = setTimeout(() => {
        this.show = false
      }, 1000)
    }
  }
}
</script>
