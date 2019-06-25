<template>
  <q-page padding>
    <h4 class="text-weight-light no-margin q-py-md text-center">About the Project</h4>
    <div class="row">
      <div class="col-9">
        <div class="full-width">
          <router-view />
        </div>
      </div>
      <div class="col-3">
        <q-card dense flat bordered>
          <q-card-section>
            <div class="text-h5 text-weight-light">Navigation</div>
          </q-card-section>
          <q-card-section>
            <q-list>
              <q-item to="/about" clickable v-close-popup>
                <q-item-section>
                  <q-item-label>About The Project</q-item-label>
                </q-item-section>
              </q-item>

              <q-item to="/about/aboutdatabrary" clickable v-close-popup>
                <q-item-section>
                  <q-item-label>About Databrary</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Mission</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Why Share mission Data</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Use Cases</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Jobs</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Press and Publications</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>News Letter</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Support</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {

};
</script>

<style>

</style>
