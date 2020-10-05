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
        <q-btn label="Back" @click="onBack()" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</template>

<script>
// TODO(Reda): Add here the wizard for creating a volume
import createProject from '@gql/createProject.gql'
import { sync } from 'vuex-pathify'

export default {
  data () {
    return {
      name: null
    }
  },
  computed: {
    asset: sync('pam/asset'),
    selectedProjectView: sync('pam/selectedProjectView'),
    createView: sync('pam/createView'),
    viewCreated: sync('pam/viewCreated'),
    pamId: sync('pam/pamId')
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

    onBack () {
      this.createView = false
    },

    async createProject () {
      // Call to the graphql mutation
      await this.$apollo.mutate({
        mutation: createProject,
        variables: {
          parentId: this.pamId,
          name: this.name
        }
      })
      this.viewCreated += 1
      this.createView = false
    }
  }
}
</script>
