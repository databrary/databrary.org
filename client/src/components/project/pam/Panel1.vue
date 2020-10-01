<template>
  <q-list>
    <q-item
      @click="onClickData"
      clickable
      v-ripple
      active-class="bg-teal-1 text-grey-8"
    >
      <q-item-section avatar>
        <q-icon color="primary" name="folder" />
      </q-item-section>
      <q-item-section>
        <q-item-label lines="1">Data</q-item-label>
      </q-item-section>
    </q-item>
     <q-item-label header>Views</q-item-label>

    <q-expansion-item
      v-if="groups.private.length"
      expand-separator
      default-opened
      header-class="bg-primary text-white expansion-items"
      label="Private"
    >
      <q-item
        clickable
        v-ripple
        v-for="(item, index) in groups.private"
        :item="item"
        :index="index"
        :key="index"
        @click="onClickView(item.id)"
        active-class="bg-teal-1 text-grey-8"
      >
        <q-item-section>
          <q-item-label lines="1">{{item.name}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>
    <q-expansion-item
      v-if="groups.network.length"
      expand-separator
      default-opened
      header-class="bg-primary text-white expansion-items"
      label="Network-Viewable"
    >
      <q-item
        clickable
        v-ripple
        v-for="(item, index) in groups.network"
        :item="item"
        :index="index"
        :key="index"
        @click="onClickView(item.id)"
        active-class="bg-teal-1 text-grey-8"
      >
        <q-item-section>
          <q-item-label lines="1">{{item.name}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>
    <q-expansion-item
      v-if="groups.public.length"
      expand-separator
      default-opened
      header-class="bg-primary text-white expansion-items"
      label="Publically-Viewable"
    >
      <q-item
        clickable
        v-ripple
        v-for="(item, index) in groups.public"
        :item="item"
        :index="index"
        :key="index"
        @click="onClickView(item.id)"
        active-class="bg-teal-1 text-grey-8"
      >
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
import { sync } from 'vuex-pathify'

export default {
  name: 'PageIndex',
  components: {
  },
  data: () => ({

    groups: {
      public: [{
        id: 1,
        name: 'Jeff et al. 2019'
      },
      {
        id: 3,
        name: 'Paper 2 for the Public'
      }
      ],
      private: [{
        id: 3,
        name: 'Paper 1 in Progress'
      }],
      network: [
        {
          id: 3,
          name: 'Paper 2 for with Data'
        }
      ]
    },
    projectIdFromRoute: null
  }),
  watch: {
    '$route': 'fetchData'
  },
  computed: {
    asset: sync('pam/asset'),
    selectedProjectView: sync('pam/selectedProjectView'),
    createView: sync('pam/createView')
  },
  async created () {
    // this.generateCitation('http://doi.org/10.17910/B77P4V')
    this.projectIdFromRoute = this.$route.params.projectId
    this.fetchData()
  },
  methods: {
    async onClickData () {
      this.selectedProjectView = null
    },
    async onClickView (id) {
      console.log('id', id)
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
