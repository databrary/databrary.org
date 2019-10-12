<template>
  <q-page padding>
    <div class="row max-page-width">
      <div class="col-xs-12 col-sm-9 col-md-9">
        <div class="full-width">
          <router-view />
        </div>
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3">
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

              <q-item to="/about/about-databrary" clickable v-close-popup>
                <q-item-section>
                  <q-item-label>About Databrary</q-item-label>
                </q-item-section>
              </q-item>

              <q-item to="/about/mission" clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Mission</q-item-label>
                </q-item-section>
              </q-item>

              <q-item to="/about/why-share-data" clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Why Share mission Data</q-item-label>
                </q-item-section>
              </q-item>

              <q-item  to="/about/use-cases" clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Use Cases</q-item-label>
                </q-item-section>
              </q-item>

              <q-item to="/about/our-team" clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Our Team</q-item-label>
                </q-item-section>
              </q-item>

              <q-item to="/about/jobs" clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Jobs</q-item-label>
                </q-item-section>
              </q-item>

              <q-item to="/about/press-and-publications" clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Press and Publications</q-item-label>
                </q-item-section>
              </q-item>

              <q-item to="/about/news-letter" clickable v-close-popup>
                <q-item-section>
                  <q-item-label>News Letter</q-item-label>
                </q-item-section>
              </q-item>

              <q-item to="/about/support" clickable v-close-popup>
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

}
</script>

<style>

</style>
