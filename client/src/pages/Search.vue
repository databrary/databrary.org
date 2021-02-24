<template>
  <q-page padding class="max-page-width">
    <h4 class="text-weight-light no-margin q-py-md text-center">Search</h4>
    <section class="row">
      <article
        class="col-xs-12 col-sm-12 col-md-3"
      >
        <q-card class="q-mx-md-sm q-mb-sm" square flat bordered>
          <q-card-section>
            <label>Search</label>
            <q-input
              tabindex="-1"
              v-model="search"
              debounce="100"
              filled
              square
              placeholder="Search"
              hint
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-separator inset spaced />
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
            <q-separator inset spaced />
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
        <div v-if="loading" class="flex">
          <q-inner-loading :showing="loading">
            <q-spinner size="50px" color="primary" />
          </q-inner-loading>
        </div>
        <div v-else >
          <div class="q-mb-sm" v-for="(doc, index) in getData" :key="index">
            <ProfileCard :search=search :profile=doc />
            <!-- <ProjectCard v-else :project=doc /> -->
          </div>
          <q-pagination
            v-if="data.length > 0"
            class="justify-content-center"
            v-model="page"
            :max="Math.ceil(data.length/cardPerPage)"
            :input="true"
          >
          </q-pagination>
        </div>
      </article>
    </section>
  </q-page>
</template>

<script>
import _ from 'lodash'

// import ProjectCard from '../../components/search/ProjectCard'
import ProfileCard from '@/components/search/ProfileCard'

export default {
  name: 'PageSearch',
  data () {
    return {
      search: null,
      startDate: null,
      endDate: null,
      tags: null,
      data: [],
      page: 1,
      cardPerPage: 10,
      loading: false,
      client: null
    }
  },
  components: {
    // ProjectCard,
    ProfileCard
  },
  watch: {
    async search () {
      await this.doSearch()
      // Note: No need to push the search as a query string
      // It will call the backend after each event in search input
      // this.$router.push({
      //   path: 'search',
      //   query: { ...this.$route.query, q: this.search }
      // })
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
    getData () {
      return this.data.slice((this.page - 1) * this.cardPerPage, (this.page - 1) * this.cardPerPage + this.cardPerPage)
    }
  },
  methods: {
    // ...mapActions('app', ['search']),
    async doSearch () {
      const { hits } = await this.$typesense
        .collections(['databrary-users'])
        .documents()
        .search({
          q: this.search,
          query_by: 'familyName,givenName,additionalName,displayFullName,bio'
        })
      this.data = _.map(hits, 'document')
    }
  }
}
</script>
