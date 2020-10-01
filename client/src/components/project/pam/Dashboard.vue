<template>
  <div>
    <q-toolbar>
      <q-toolbar-title>
        {{ asset.name }}
      </q-toolbar-title>
      <q-btn
        :to="asset.id + '/contributors'"
        flat
        icon="person"
        label="Contributors"
      />
    </q-toolbar>
    <div class="q-pa-md">
      <q-splitter
        v-model="firstModel"
        :style="{height: ($q.screen.height-50-16)+'px'}"
      >
        <template v-slot:before>
          <q-scroll-area
            :style="{height: ($q.screen.height-50-16)+'px'}"
          >
            <Panel1 />
          </q-scroll-area>
        </template>
        <template v-slot:after>
          <ProjectViewer
            v-if="selectedProjectView"
          />
          <CreateView
            v-else-if="createView"
          />
          <q-splitter
            v-else
            v-model="secondModel"
            :style="{height: ($q.screen.height-50-16)+'px'}"
          >
            <template v-slot:before>
              <Panel2 />
            </template>
            <template v-slot:after>
              <q-scroll-area
                :style="{height: ($q.screen.height-50-16)+'px'}"
              >
                <Panel3 />
              </q-scroll-area>
            </template>
          </q-splitter>
        </template>
      </q-splitter>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { date } from 'quasar'
import { gql } from '@apollo/client'
import { sync } from 'vuex-pathify'

import Panel1 from './Panel1.vue'
import Panel2 from './Panel2.vue'
import Panel3 from './Panel3.vue'
import ProjectViewer from './ProjectViewer.vue'
import CreateView from './CreateView.vue'

export default {
  name: 'PageIndex',
  components: {
    Panel1,
    Panel2,
    Panel3,
    ProjectViewer,
    CreateView
  },
  data: () => ({
    date,
    firstModel: 20,
    secondModel: 30,
    datetimeCreated: null
  }),
  watch: {
    '$route': 'fetchData'
  },
  async created () {
    // this.generateCitation('http://doi.org/10.17910/B77P4V')
    this.projectIdFromRoute = this.$route.params.projectId
    this.fetchData()
  },
  computed: {
    asset: sync('pam/asset'),
    pamId: sync('pam/pamId'),
    selectedProjectView: sync('pam/selectedProjectView'),
    createView: sync('pam/createView')
  },
  methods: {
    async fetchData () {
      const result = await this.$apollo.query({
        query: gql`
          query GetProject($projectId: Int!) {
            assets(where: {
              id: {_eq: $projectId},
              assetType: {_eq: pam}
            }) {
              id
              assetType
              name
              datetimeCreated
            }
          }
        `,
        variables: {
          projectId: this.projectIdFromRoute
        }
      })
      this.asset = result.data.assets[0]
      this.pamId = this.asset.id
      this.datetimeCreated = date.formatDate(
        this.asset.datetimeCreated,
        'YYYY-MM-DD'
      )
    }
  }
}
</script>
