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
import { mapActions } from 'vuex'
// TODO(Reda): Add here the wizard for creating a volume
import mutation from '../graphql/createPam'

export default {
  data () {
    return {
      name: null
    }
  },

  methods: {
    ...mapActions('assets', ['insertAsset']),
    async onSubmit () {
      try {
        const projectId = await this.insertAsset(
          {
            name: this.name,
            assetType: 'project',
            privacyType: 'private'
          }
        )

        this.$router.push({
          path: `/project/${projectId}`
        })

        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
      } catch (error) {
        console.log(error.message)
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Failed!'
        })
      }
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
        path: `/pam/${project.id}`
      })
    }
  }
}
</script>
