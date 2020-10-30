<template>
  <div class="q-pa-md">
    <q-splitter
      v-model="firstModel"
    >
      <template v-slot:before>
        <q-scroll-area
          v-if="pams"
          :style="{height: ($q.screen.height-50-16-16-50-1)+'px'}"
          style="max-width: 400px;"
        >
          <q-list>
            <q-item header>
              <q-item-section>
                Projects
              </q-item-section>
              <q-item-section side>
                <q-icon
                  name="add_circle_outline"
                  @click="showCreateAsset = true"
                />
              </q-item-section>
            </q-item>
            <q-item
              v-for="pam in pams"
              :key="pam.id"
              clickable
              v-ripple
              @click="selectedPam = pam.id"
              :active="selectedPam == pam.id"
              active-class="text-white bg-secondary"
            >
              <q-item-section>{{pam.name}}</q-item-section>
              <q-item-section side>
                <q-icon
                  name="keyboard_arrow_right"
                  :color="selectedPam == pam.id ? 'white' : 'green'"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </template>
      <template v-slot:after>
        <DashboardEmbed
          v-if="selectedPam && !showCreateAsset"
          :id.sync="selectedPam"
        />
        <CreateAsset
          v-else-if="showCreateAsset"
          @onHideShowCreateAsset="showCreateAsset = false"
          assetType="pam"
        />
      </template>
    </q-splitter>
  </div>
</template>

<script>
import createAsset from '@gql/createAsset.gql'
import { sync } from 'vuex-pathify'
import { date } from 'quasar'
import { gql } from '@apollo/client'

import _ from 'lodash'

import getAssetsByType from '@gql/getAssetsByType.gql'

import CreateAsset from '@/components/project/pam/CreateAsset.vue'
import DashboardEmbed from '@/components/project/pam/DashboardEmbed.vue'

export default {
  name: 'LandingLoggedIn',
  components: {
    DashboardEmbed,
    CreateAsset
  },
  data () {
    return {
      activeList: [],
      activeListLevel: 1,
      date,
      projects: [],
      firstModel: 20,
      showCreateAsset: false
    }
  },
  computed: {
    pams: sync('pam/pams'),
    selectedPam: sync('pam/selectedPam'),
    refreshPams: sync('pam/refreshPams'),
    selectedProjectView: sync('pam/selectedProjectView')
  },
  async created () {
    await this.fetchData()
  },
  watch: {
    async refreshPams () {
      if (this.refreshPams) {
        await this.fetchData()
        this.refreshPams = false
      }
    },
    selectedPam () {
      this.selectedProjectView = null
    }
  },
  methods: {
    clickPam (id) {
      this.selectedPam = id
    },
    async fetchData () {
      try {
        const { data } = await this.$apollo.query({
          query: getAssetsByType,
          variables: {
            assetType: 'pam'
          }
        })
        this.pams = _.get(data, 'assets', [])
      } catch (error) {
        console.error(error.message)
      }
    }
  }
}
</script>
