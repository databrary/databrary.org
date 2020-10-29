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
                  @click="onClickAddPam"
                />
              </q-item-section>
            </q-item>
            <SelectableListItem
              v-for="pam in pams"
              :key="pam.id"
              clickable
              v-ripple
              :activeList="activeList"
              :level="activeListLevel"
              :label="pam.name"
              @click="clickPam(pam.id)"
            />
            <!-- <q-item-label caption>{{date.formatDate(new Date(item.datetime_created), 'YYYY-MM-DD HH:mm')}}</q-item-label> -->
          </q-list>
        </q-scroll-area>
      </template>
      <template v-slot:after>
        <DashboardEmbed
          v-if="pamId"
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

import SelectableListItem from '@/components/generic/SelectableListItem.vue'
import DashboardEmbed from '@/components/project/pam/DashboardEmbed.vue'

export default {
  name: 'LandingLoggedIn',
  components: {
    DashboardEmbed,
    SelectableListItem
  },
  data () {
    return {
      activeList: [],
      activeListLevel: 1,
      date,
      projects: [],
      firstModel: 20
    }
  },
  computed: {
    userId: sync('app/dbId'),
    pams: sync('pam/pams'),
    pamId: sync('pam/pamId'),
    selectedProjectView: sync('pam/selectedProjectView')
  },
  async created () {
    this.fetchData()
  },
  methods: {
    clickPam (id) {
      this.pamId = id
      this.selectedProjectView = null
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
    },
    async onClickAddPam () {
      await this.$apollo.mutate({
        mutation: createAsset,
        variables: {
          name: this.name,
          assertType: 'pam'
        }
      })
    }
  }
}
</script>
