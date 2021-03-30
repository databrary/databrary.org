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
        :label="`${assetType === 'pam' ? 'Project' : assetType === 'list' ? 'List' : 'View'} title *`"
        :hint="`Name your ${assetType === 'pam' ? 'Project' : assetType === 'list' ? 'List' :'View'} something descriptive`"
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
import createAsset from '@gql/createAsset.gql'
import { sync } from 'vuex-pathify'

export default {
  props: {
    assetType: {
      type: String,
      required: true
    },
    parentId: {
      type: Number,
      default: () => null
    }
  },
  data () {
    return {
      name: null
    }
  },
  computed: {
    refreshViews: sync('pam/refreshViews'),
    refreshPams: sync('pam/refreshPams'),
    refreshBookmarks: sync('pam/refreshBookmarks')
  },
  methods: {
    async onSubmit () {
      try {
        const asset = await this.createAsset()
        switch (this.assetType) {
          case 'project':
            this.refreshViews = true
            break
          case 'list':
            this.refreshBookmarks = true
            break
          default:
            this.refreshPams = true
            break
        }
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
      } catch (error) {
        console.error('onSubmit::', error.message)
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Failed'
        })
      } finally {
        this.name = null
        this.hideShowCreateAsset()
      }
    },

    onReset () {
      this.name = null
    },

    onBack () {
      this.hideShowCreateAsset()
    },

    hideShowCreateAsset () {
      this.$emit('update:assetType', null)
    },

    async createAsset () {
      // Call to the graphql mutation
      const { data } = await this.$apollo.mutate({
        mutation: createAsset,
        variables: {
          parentId: this.parentId,
          name: this.name,
          assetType: this.assetType
        }
      })

      this.hideShowCreateAsset()
      return data.insert_assets.returning[0]
    }
  }
}
</script>
