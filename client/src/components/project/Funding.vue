<template>
    <q-item
        v-if="funding"
        class="row"
        dense
    >
        <q-item-section avatar>
          <q-avatar>
            <q-icon size="6px" name="circle" />
          </q-avatar>
        </q-item-section>
        <q-item-section class="col-8">
          <span
            class="full-width text-capitalize text-capitalize ellipsis overflow-hidden text-no-wrap"
            :title="funding.funder.name"
          >
            {{funding.funder.name}}
          </span>
        </q-item-section>
        <q-item-section class="col-4">
          <span
            class="full-width"
            :title="funding.award"
          >
            {{funding.award}}
          </span>
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
