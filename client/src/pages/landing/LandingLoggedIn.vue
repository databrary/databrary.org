<template>
  <div class="q-pa-md">
    <q-splitter
      v-model="firstModel"
      :style="{height: ($q.screen.height-50-16)+'px'}"
    >
      <template v-slot:before>
        <q-scroll-area v-if="projects" :style="{height: ($q.screen.height-250)+'px'}" style="max-width: 400px;">
          <q-list>
            <q-item header>
              <q-item-section>
                Projects
              </q-item-section>
              <q-item-section side>
                <q-icon name="add_circle_outline" :to="{ name: 'createProject' }"/>
                <!-- <q-icon name="arrow" color="green" /> -->
              </q-item-section>
            </q-item>
            <SelectableListItem
              v-for="item in projects"
              :key="item.id"
              clickable
              v-ripple
              :activeList="activeList"
              :level="activeListLevel"
              :label="item.name"
              @click="clickPam(item.id)"
            />
            <!-- <q-item-label caption>{{date.formatDate(new Date(item.datetime_created), 'YYYY-MM-DD HH:mm')}}</q-item-label> -->
          </q-list>
        </q-scroll-area>
      </template>
      <template v-slot:after>
        <DashboardEmbed
          v-if="pamId"
          :id="pamId"
        />
      </template>
    </q-splitter>
  </div>
</template>

<script>
import { sync } from 'vuex-pathify'
import { date } from 'quasar'
import { gql } from '@apollo/client'

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
      firstModel: 20,
      pamId: null
    }
  },
  computed: {
    userId: sync('app/dbId')
  },
  async created () {
    this.fetchData()
  },
  methods: {
    clickPam (id) {
      this.pamId = id
    },
    async fetchData () {
      const result = await this.$apollo.query({
        query: gql`
          query GetProjectsByUserId($userId: Int!) {
            assets(
              where: {assetType: {_eq: pam}, _and: {createdById: {_eq: $userId}}}
              order_by: {datetimeCreated: desc}
            ) {
              id
              name
              datetimeCreated
            }
          }
        `,
        variables: {
          userId: this.userId
        }
      })
      this.projects = result.data.assets
    }
  }
}
</script>
