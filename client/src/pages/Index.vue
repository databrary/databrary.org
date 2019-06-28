<template>
  <div>
    <q-page padding class="flex text-center">
      <section class="text-center fit">
        <div class="text-weight-thin text-h1 block q-pt-lg">
          <q-avatar size="80px">
            <img src="../assets/databrary-logo.png" />
          </q-avatar>
          <span class="text-weight-light">Data</span>brary
        </div>
        <div class="text-h5 text-weight-light">
          Video data library for behavioral scientists
        </div>
        <q-input
          v-on:keyup.enter="search"
          v-model="searchText"
          type="search"
          class="search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </section>
      <section class="row q-my-xl q-py-xl justify-center fit">
        <div class="col-md-9 col-sm-10">
          <div class="row">
            <div class="col-md-6 col-sm-12">
              <h4 class="text-weight-light no-margin">Find &amp; Use</h4>
              <p>
                Find and use video, audio and, data for presentations to learn
                about procedures.
              </p>
            </div>
            <div class="col-md-6 col-sm-12">
              <h4 class="text-weight-light no-margin">Archive &amp; Share</h4>
              <p>
                Securely store all your project information, research data, and
                procedures. Improve transparency and reproducibility by sharing
                data and documenting procedures.
              </p>
            </div>
          </div>
        </div>
      </section>
      <!-- Video section -->
      <section>
        <h4 class="text-weight-light no-margin q-py-md">Highlighted Videos</h4>
        <div
          class="row q-my-xl q-py-xl justify-center fit no-margin no-padding"
        >
          <div class="col-md-9 col-sm-10">
            <div class="row">
              <div class="col-md-4 col-sm-6 group" v-for="n in 3" :key="n">
                <q-card inline class="q-ma-sm">
                  <q-video
                    src="https://www.youtube.com/embed/OfIQW6s1-ew"
                  />
                  <q-card-section>
                    Adolph, K. (2018). Excerpt: The organization of exploratory
                    behaviors in infant locomotor planning. Databrary.
                    http://doi.org/10.17910/B7.595.
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </q-page>
    <!-- Stats -->
    <section
      class="row q-mt-xl fit text-center"
      style="background: rgb(44, 62, 81);"
    >
      <div class="col-md-3 col-sm-6 col-xs-6 group q-py-lg">
        <h4 class="text-white no-margin">772</h4>
        <h4 class="stats-header no-margin">investigators</h4>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-6 group q-py-lg">
        <h4 class="text-white no-margin">306</h4>
        <h4 class="stats-header no-margin">affiliates</h4>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-6 group q-py-lg">
        <h4 class="text-white no-margin">406</h4>
        <h4 class="stats-header no-margin">institutions</h4>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-6 group q-py-lg">
        <h4 class="text-white no-margin">33,372</h4>
        <h4 class="stats-header no-margin">hours recorded</h4>
      </div>
    </section>
    <!-- Map -->
    <section class="row fit text-center">
      <div class="col">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d83998.91163207506!2d2.347059899999999!3d48.858858949999984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sfr!4v1425301582595"
          width="100%"
          height="500"
          frameborder="0"
          style="border:0"
        ></iframe>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: 'PageIndex',
  data() {
    return {
      searchText: '',
    };
  },
  methods: {
    /**
     * Send user to search page with ?q=this.search
     */
    search() {
      const trimmedSearchText = this.searchText.replace(/\s/g, '');
      if (trimmedSearchText) {
        this.$router.push({ path: 'search', query: { q: this.searchText } });
      }
    },
  },
};
</script>

<style scoped>
.search {
  max-width: 500px;
  margin: auto;
}
.stats-header {
  color: rgb(92, 170, 188);
}
</style>
