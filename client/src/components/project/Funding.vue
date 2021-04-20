<template>
    <q-item
        v-if="funding"
        class="row"
        dense
    >
        <q-item-section class="col-8">
          <q-item-label
            class="full-width ellipsis overflow-hidden text-no-wrap"
            :title="funding.funder.name"
          >
            {{funding.funder.name}}
          </q-item-label>
          <q-item-label
            caption
          >
            <a :href="funding.funder.doi">{{funding.funder.doi}}</a>
          </q-item-label>
        </q-item-section>
        <q-item-section class="col-4">
          <q-item-label
            class="full-width"
            :title="funding.award"
          >
            {{funding.award}}
          </q-item-label>
        </q-item-section>
      </q-item>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    funding: null
  }),
  mounted () {
    this.funding = this.data
  },
  watch: {
    data () {
      this.funding = this.data
    }
  }
}
</script>

<style>

</style>
