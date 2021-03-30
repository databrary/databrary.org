<template>
  <div
    class="row"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
  >
    <q-img
      :class="useImage && imageURI ? 'col-12 bg-grey-10': 'col-12'"
      :src="src"
      :style="imgObjStyle"
      contain
    />
    <div
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
      v-show="showEdit"
      class="absolute-right"
    >
      <q-btn
        @mouseover="onMouseOver"
          @mouseleave="onMouseLeave"
          rounded class="text-white q-ma-xs" icon="edit" >
        <q-menu
          @mouseover="onMouseOver"
          @mouseleave="onMouseLeave"
          @show="onMenuShow" @hide="onMenuHide">
          <q-item>
            <q-item-section>
              <ImageUploader
                assetType="file"
                :assetName="`Project ${id} Image`"
                @upload-success="onUploadSuccess"
              />
              <q-btn flat class="avatar-uploader text-left" align="left" label="Upload Image"/>
              <q-btn flat class="text-left" align="left" @click="onLastImageClick" label="Last Image" v-close-popup/>
              <q-btn flat class="text-left" label="Solid Color" align="left" @click="showColorPickerDialog = true" v-close-popup/>
            </q-item-section>
          </q-item>
        </q-menu>
      </q-btn>
    </div>
    <q-dialog v-model="showColorPickerDialog">
      <q-card>
        <q-card-section>
          <q-color
            v-model="color"
            :palette="palette"
            dense
            no-header
            flat
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn @click="onCancel" color="primary" flat v-close-popup>Cancel</q-btn>
          <q-btn @click="onConfirm" color="primary" flat v-close-popup>Confirm</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import ImageUploader from '@/components/upload/ImageUploader'
export default {
  name: 'ProjectHeader',
  props: {
    projectId: {
      type: Number,
      required: true
    },
    projectColor: {
      type: String,
      default: () => null
    },
    projectImageURI: {
      type: String,
      default: () => null
    },
    projectUseImage: {
      type: Boolean,
      default: () => false
    },
    height: {
      type: Number,
      default: () => 400
    }
  },
  components: {
    ImageUploader
  },
  data: () => ({
    id: null, // project Id
    useImage: null,
    showEdit: false,
    showColorPickerDialog: false,
    selectedColor: null, // confirmed color to save and display
    color: null, // v-model for the color picker
    palette: [],
    imageURI: null,
    isMenuVisible: false
  }),
  mounted () {
    this.id = this.projectId
    this.selectedColor = this.projectColor
    this.imageURI = this.projectImageURI
    this.useImage = this.projectUseImage
  },
  watch: {
    projectId () {
      this.id = this.projectId
    },
    projectColor () {
      this.selectedColor = this.projectColor
    },
    projectImageURI () {
      this.imageURI = this.projectImageURI
    },
    projectUseImage () {
      this.useImage = this.projectUseImage
    }
  },
  computed: {
    imgObjStyle () {
      if (this.useImage && this.imageURI) {
        return {
          'min-height': this.height + 'px',
          'max-height': this.height + 'px'
        }
      }
      return {
        'background-color': this.selectedColor,
        'min-height': this.height + 'px',
        'max-height': this.height + 'px'
      }
    },
    src () {
      if (this.useImage && this.imageURI) return this.imageURI
      if (!this.useImage && this.selectedColor) return null
      return `https://picsum.photos/seed/${this.id}/1000/${this.height}`
    }
  },
  methods: {
    async onUploadSuccess (newAssetId) {
      this.$emit('update-image-id', newAssetId)
    },
    saveColorToPalette () {
      if (this.palette.includes(this.color) || this.color == null) return
      this.palette.push(this.color)
    },
    onCancel () {
      // Nothing to do
    },
    async onConfirm () {
      try {
        this.$emit('update-color', this.color)
        this.saveColorToPalette()
      } catch (error) {
        console.error(error.message)
      }
    },
    async onLastImageClick () {
      this.$emit('use-image', true)
    },
    onMouseOver () {
      this.showEdit = true
    },
    onMouseLeave () {
      if (this.isMenuVisible) return
      this.showEdit = false
    },
    onMenuShow () {
      this.isMenuVisible = true
    },
    onMenuHide () {
      this.isMenuVisible = false
    }
  }
}
</script>
