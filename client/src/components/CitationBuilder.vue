<template>
  <div>
    <div>
      <q-btn
        no-caps
        icon="edit"
        v-if="editMode"
        flat
        color="primary"
        @click="editCitation = true"
      />
      {{ citation }}
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
            <q-input dense class="q-pb-sm q-pr-sm" outlined v-model="family" label="Family" />
            <q-input dense class="q-pb-sm q-pr-sm" outlined v-model="given" label="Given" />
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
  data () {
    return {
      editCitation: false,
      citation: '',
      family: '',
      given: '',
      title: '',
      date: '',
      journal: '',
      tab: 'edit'
    }
  },
  mounted () {
    this.createCitation()
  },
  methods: {
    lookupCitation () {
      this.createCitation()
      this.tab = 'edit'
    },
    saveCitation () {
      this.citation = `${this.family}, ${this.given} ${this.title} (${this.date}) ${this.journal}`
    },
    createCitation () {
      const url = `https://api.crossref.org/works/${this.doi}`
      this.$axios.get(url)
        .then((response) => {
          console.log(response)
          const { message } = response.data
          this.family = message.author[0].family
          this.given = message.author[0].given
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
          this.title = message.title[0]
          this.date = this.formatDate(new Date(message.deposited['date-time']))
          this.journal = message.publisher

          this.citation = `${this.family}, ${this.given} ${this.title} (${this.date}) ${this.journal}`
        })
        .catch((error) => {
          console.log(error)
        })
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

<style>

</style>
