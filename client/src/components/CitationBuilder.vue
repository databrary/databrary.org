<template>
  <div>
    <div v-if="editMode">
      {{ citation }}
    </div>
    <div v-else>
      <q-input class="q-pb-sm" outlined v-model="family" label="Family" />
      <q-input class="q-pb-sm" outlined v-model="given" label="Given" />
      <q-input class="q-pb-sm" outlined v-model="title" label="Title" />
      <q-input class="q-pb-sm" outlined v-model="date" label="Date" />
      <q-input class="q-pb-sm" outlined v-model="journal" label="Journal" />

    </div>
  </div>
</template>

<script>
export default {
  name: 'CitationBuilder',
  props: ['doi', 'editMode'],
  data() {
    return {
      citation: '',
      family: '',
      given: '',
      title: '',
      date: '',
      journal: '',
    };
  },
  mounted() {
    this.createCitation();
  },
  watch: {
    editMode() {
      this.citation = `${this.family}, ${this.given} ${this.title} (${this.date}) ${this.journal}`;
    },
  },
  methods: {
    createCitation() {
      const url = `https://api.crossref.org/works/${this.doi}`;
      this.$axios.get(url)
        .then((response) => {
          console.log(response);
          const { message } = response.data;
          this.family = message.author[0].family;
          this.given = message.author[0].given;
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
          this.title = message.title[0];
          this.date = message.deposited['date-time'];
          this.journal = message.publisher;

          this.citation = `${this.family}, ${this.given} ${this.title} (${this.date}) ${this.journal}`;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>

</style>
