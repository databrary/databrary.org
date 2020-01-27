<template>
  <q-page
    padding
    class="max-page-width"
  >
    <h4 class="text-weight-light no-margin q-py-md text-center">Search</h4>
    <section class="row">
      <article class="col-xs-12 col-sm-12 col-md-3">
        <q-card
          class="q-mx-md-sm q-mb-sm"
          square
          flat
          bordered
        >
          <q-card-section>
            <label>Search</label>
            <q-input
              tabindex="-1"
              v-model="search"
              debounce="500"
              filled
              square
              placeholder="Search"
              hint
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-separator
              inset
              spaced
            />
            <label>Start Date</label>
            <q-input
              tabindex="-1"
              v-model="startDate"
              debounce="500"
              filled
              square
              type="date"
              hint
            />
            <label>End Date</label>
            <q-input
              tabindex="-1"
              v-model="endDate"
              debounce="500"
              filled
              square
              type="date"
              hint
            />
            <q-separator
              inset
              spaced
            />
            <label>Tags</label>
            <q-input
              tabindex="-1"
              v-model="tags"
              filled
              square
              type="Tags"
              debounce="500"
              placeholder="Tags"
              hint="separated by comma"
            />
          </q-card-section>
        </q-card>
      </article>
      <article class="col-xs-12 col-sm-12 col-md-9">
        <q-card
          square
          flat
          bordered
          class="q-mb-sm"
          v-for="n in 5"
          :key="n"
        >
          <q-card-section>
            <router-link
              class="text-primary"
              :to="'search/' + n"
              exact
            >
              <div class="text-h6">Result {{n}}</div>
            </router-link>
          </q-card-section>

          <q-card-section>
            <q-expansion-item
              label-lines="2"
              label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip"
              caption="Admin, AdminSteiger, LisaTesla, Testarosa"
            >
              <q-card>
                <q-card-section>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Quidem, eius reprehenderit eos corrupti
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-card-section>
        </q-card>
        <q-pagination
          class="justify-content-center"
          v-model="currentPage"
          :max="5"
          :input="true"
        >
        </q-pagination>
      </article>
    </section>
  </q-page>
</template>

<script>
export default {
  name: 'PageSearch',
  data () {
    return {
      search: null,
      startDate: null,
      endDate: null,
      tags: null,
      currentPage: 1
    }
  },
  mounted () {
    this.search = this.$route.query.q
  },
  watch: {
    search () {
      this.$router.push({
        path: 'search',
        query: { ...this.$route.query, q: this.search }
      })
    },
    startDate () {
      this.$router.push({
        path: 'search',
        query: { ...this.$route.query, startDate: this.startDate }
      })
    },
    endDate () {
      this.$router.push({
        path: 'search',
        query: { ...this.$route.query, endDate: this.endDate }
      })
    },
    tags () {
      this.$router.push({
        path: 'search',
        query: { ...this.$route.query, tags: this.tags.replace(/\s/g, '') }
      })
    }
  },
  computed: {
    // a computed getter
    // queryString: function () {
    //   return {
    //     q: this.search,
    //   }
    // }
  }
}
</script>
<style>
</style>
