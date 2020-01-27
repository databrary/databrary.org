<template>
  <div>
    <q-page
      padding
      class="flex text-center"
    >
      <section class="text-center fit">
        <div class="text-weight-thin text-h1 block q-pt-lg">
          <q-avatar size="80px">
            <img src="../../assets/databrary-logo.png" />
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
        <div class="row q-my-xl q-py-xl justify-center fit no-margin no-padding">
          <div class="col-md-9 col-sm-10">
            <div class="row">
              <div
                class="col-md-4 col-sm-6 group"
                v-for="n in 3"
                :key="n"
              >
                <q-card
                  inline
                  class="q-ma-sm"
                >
                  <q-video src="https://www.youtube.com/embed/OfIQW6s1-ew" />
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
    <Stats />
    <Map />
  </div>
</template>
<script>
import Map from '../../components/LandingPage/Map'
import Stats from '../../components/LandingPage/Stats'

export default {
  name: 'LandingLoggedOut',
  components: {
    Map,
    Stats
  },
  data () {
    return {
      searchText: ''
    }
  },
  methods: {
    /**
     * Send user to search page with ?q=this.search
     */
    search () {
      const trimmedSearchText = this.searchText.replace(/\s/g, '')
      if (trimmedSearchText) {
        this.$router.push({ path: 'search', query: { q: this.searchText } })
      }
    }
  }
}
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
