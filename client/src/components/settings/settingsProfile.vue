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
        <img src="https://cdn.quasar-framework.org/img/avatar2.jpg">
      </q-avatar>
      <br>
      <q-btn
        flat
        class="q-my-sm"
        color="primary"
        label="Change profile picture"
        @click="promptDialogPicture = true"
      />
      <q-dialog v-model="promptDialogPicture" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">Upload new profile picture</div>
          </q-card-section>

          <q-card-section class="q-pb-none">
            <q-uploader
              url="http://localhost:4444/upload"
              label="Uploader"
              accept=".jpg, image/*"
              class="fit"
              flat
            />
         </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn
              color="info"
              flat
              label="use Gravatar instead"
              @click="promptDialogPicture = false"
            />
            <q-btn flat label="Confirm" @click="promptDialogPicture = false"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      promptDialogPicture: false
    }
  }
}
</script>
