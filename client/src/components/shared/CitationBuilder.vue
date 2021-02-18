<template>
  <div>
    <div v-if="!doi">Citation not available</div>
    <div v-else>
      <q-btn
        no-caps
        icon="edit"
        v-if="editMode"
        flat
        color="primary"
        @click="editCitation = true"
      />
      <div class="row" v-if="!errorMessage">
        <q-skeleton class="col-6" v-if="loading" type="text" />
        <div class="col-12" v-else>{{citation}}</div>
      </div>
      <div class="row" v-else>
        <span class="col-12">{{errorMessage}}</span>
      </div>
    </div>
    <q-dialog
      v-model="editCitation"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Edit Citation</div>
        </q-card-section>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="edit" label=Edit />
          <q-tab name="lookup" label="Lookup" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="edit">
            <div class="text-h6">Edit</div>
            <q-input dense class="q-pb-sm q-pr-sm" outlined v-model="authors" label="Authors" />
            <q-input dense class="q-pb-sm q-pr-sm" outlined v-model="title" label="Title" />
            <q-input dense class="q-pb-sm q-pr-sm" outlined v-model="date" label="Date" />
            <q-input dense class="q-pb-sm q-pr-sm" outlined v-model="journal" label="Journal" />
            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn v-on:click="saveCitation" flat label="Save" v-close-popup />
            </q-card-actions>
          </q-tab-panel>

          <q-tab-panel name="lookup">
            <div class="text-h6">Lookup</div>
            <q-input dense class="q-pb-sm q-pr-sm" outlined v-model="doi" label="DOI" />
            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn v-on:click="lookupCitation" flat label="Lookup" />
            </q-card-actions>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'CitationBuilder',
  props: ['doi', 'editMode'],
  data: () => ({
    loading: false,
    editCitation: false,
    errorMessage: '',
    authors: '',
    title: '',
    date: '',
    journal: '',
    url: '',
    tab: 'edit'
  }),
  mounted () {
    this.createCitation()
  },
  computed: {
    citation () {
      return `${this.authors}, ${this.title} (${this.date}) ${this.journal}`
    }
  },
  watch: {
    async doi () {
      this.errorMessage = ''
      await this.createCitation()
    }
  },
  methods: {
    lookupCitation () {
      this.createCitation()
      this.tab = 'edit'
    },
    saveCitation () {
      this.citation = `${this.authors}, ${this.title} (${this.date}) ${this.journal}`
    },
    async createCitation () {
      try {
        this.loading = true
        const url = `https://api.test.datacite.org/dois/${this.doi}`
        const { data: { data: { attributes } } } = await this.$axios.get(url)
        this.authors = attributes.creators.map((creator) => (creator.name)).join(',')
        this.title = attributes.titles[0].title
        this.date = this.formatDate(new Date(attributes.registered))
        this.journal = attributes.publisher
        this.url = `https://doi.org/${attributes.doi}`
      } catch (error) {
        this.errorMessage = 'Citation not available'
        console.error('createCitation::', error)
      } finally {
        this.loading = false
      }
    },
    formatDate (date) {
      const monthNames = [
        'January', 'February', 'March',
        'April', 'May', 'June', 'July',
        'August', 'September', 'October',
        'November', 'December'
      ]
      const day = date.getDate()
      const monthIndex = date.getMonth()
      const year = date.getFullYear()

      return `${day} ${monthNames[monthIndex]} ${year}`
    }
  }
}
</script>
