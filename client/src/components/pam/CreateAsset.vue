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
        :label="label"
        :hint="hint"
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
export default {
  props: {
    assetType: {
      type: String,
      required: false,
      default: () => 'pam'
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
    label () {
      return `${this.assetType === 'pam'
        ? 'Assets' : this.assetType === 'list' ? 'List' : 'Project'} 
        title *`
    },
    hint () {
      return `Name your ${this.assetType === 'pam'
        ? 'Assets' : this.assetType === 'list' ? 'List' : 'Project'} 
        something descriptive`
    }
  },
  methods: {
    async onSubmit () {
      this.$emit('insert-asset', this.name)
    },

    onReset () {
      this.name = null
    },

    onBack () {
      this.hideShowCreateAsset()
    },

    hideShowCreateAsset () {
      this.$emit('update:assetType', null)
    }
  }
}
</script>
