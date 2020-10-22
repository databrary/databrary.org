<template>
  <q-list>

    <q-expansion-item
      expand-separator
      default-opened
     :key="$route.params.slug"
    >
      <template v-slot:header>
        <q-item-section avatar>
          <q-icon color="primary" name="art_track" />
        </q-item-section>

        <q-item-section>
          Views
        </q-item-section>
      </template>

      <q-item
        clickable
        v-ripple
        v-for="(item, index) in views"
        :item="item"
        :index="index"
        :key="index"
        @click="onClickView(item.id)"
        active-class="bg-teal-1 text-grey-8"
      >
        <q-item-section avatar>
          <q-icon color="primary" name="preview" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{item.name}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>

    <q-item
      active-class="bg-teal-1 text-grey-8"
      class="fixed-bottom"
      label="Create View"
    >
      <q-btn color="primary" label="Create View"
        @click="onCreateView"
      />
    </q-item>
  </q-list>
</template>

<style scoped lang="stylus">
.expansion-items
  font-weight: 2em
</style>

<script>
import Vue from 'vue'
import { gql } from '@apollo/client'
import { sync } from 'vuex-pathify'

export default {
  name: 'PageIndex',
  components: {
  },
  data: () => ({
    projectIdFromRoute: null
  }),
  watch: {
    '$route': 'fetchData'
  },
  computed: {
    asset: sync('pam/asset'),
    views: sync('pam/views'),
    selectedProjectView: sync('pam/selectedProjectView'),
    createView: sync('pam/createView')
  },
  async created () {
    this.fetchData()
  },
  methods: {
    async onClickData () {
      this.selectedProjectView = null
    },
    async onClickView (id) {
      this.selectedProjectView = id
    },
    async onCreateView () {
      this.createView = true
    },
    async fetchData () {
    }
  }
}
</script>
