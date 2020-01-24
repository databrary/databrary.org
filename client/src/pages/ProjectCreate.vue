<template>
  <div class="q-pa-md" style="max-width: 400px">

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="name"
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
// TODO(Reda): Add here the wizard for creating a volume
import mutation from '../graphql/createProject'

export default {
  data () {
    return {
      name: null
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
      console.log(this.name, mutation(this.name))
      const results = await this.$apollo.mutate(mutation(this.name))

      const project = results.data.insert_assets.returning[0]
      this.$router.push({
        path: `/project/${project.id}`
      })
    }
  }
}
</script>
