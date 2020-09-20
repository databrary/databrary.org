<template>
  <div>
    <!-- <q-page padding class="flex text-center"> -->
    <!-- <section class="text-left fit"></section> -->
    <!-- </q-page> -->
    <div class="q-pa-md">
      <div class="row">
        <div class="col">
          <q-btn color="primary" :to="{ name: 'createProject' }" label="Create project" />
          <q-scroll-area v-if="projects" :style="{height: ($q.screen.height-250)+'px'}" style="max-width: 400px;">
            <q-list>
              <q-item-label header>Projects</q-item-label>
              <q-item
                v-for="item in projects"
                :key="item.id"
                clickable
                v-ripple
                :to="{ name: 'projectLanding', params: { projectId: item.id }}"
              >
                <q-item-section avatar top>
                  <q-avatar icon="folder" color="primary" text-color="white" />
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">{{ item.name }}</q-item-label>
                  <q-item-label caption>{{date.formatDate(new Date(item.datetime_created), 'YYYY-MM-DD HH:mm')}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon name="info" color="green" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sync } from 'vuex-pathify'
import { date } from 'quasar'
import { gql } from '@apollo/client'

export default {
  name: 'LandingLoggedIn',
  data () {
    return {
      date,
      projects: []
    }
  },
  computed: {
    userId: sync('app/dbId')
  },
  async created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      const result = await this.$apollo.query({
        query: gql`
          query GetProjectsByUserId($userId: Int!) {
            assets(
              where: {assetType: {_eq: project}, _and: {createdById: {_eq: $userId}}}
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
