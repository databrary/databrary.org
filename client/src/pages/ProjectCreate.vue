<template>
  <div class="q-pa-md" style="max-width: 400px">

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="title"
        label="Project title *"
        hint="Name your project something descriptive"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type a title']"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data () {
    return {
      title: null
    }
  },

  methods: {
    async onSubmit () {
      await this.createProject()

      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Submitted'
      })
    },

    onReset () {
      this.name = null
      this.age = null
      this.accept = false
    },

    async createProject () {
      // Call to the graphql mutation
      const result = await this.$apollo.mutate({
        // Query
        mutation: gql`mutation ($title: String!) {
          insert_projects(
            objects: { 
              title: $title 
            }
          )
        }`,
        // Parameters
        variables: {
          title: this.title
        }
      })
      console.log(result)
    }
  }
}
</script>
