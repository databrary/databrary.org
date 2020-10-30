<template>
  <div class="q-pa-md">
    <q-splitter
      v-model="firstModel"
      :limits="[10, 30]"
    >
      <template v-slot:before>
        <q-list>
          <q-item header>
            <q-item-section class="text-bold">
              Projects
            </q-item-section>
            <q-item-section side>
              <q-icon
                name="add_circle_outline"
                @click="onAddClick('pam')"
              />
            </q-item-section>
          </q-item>
          <q-scroll-area
            :style="{height: ($q.screen.height-50-16-16-50-1) / 2+'px'}"
            v-if="pams"
          >
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
          </q-scroll-area>
        </q-list>
        <q-list>
          <q-item class="col-12" header>
            <q-item-section class="text-bold">
              Bookmarks
            </q-item-section>
            <q-item-section side>
              <q-icon
                name="add_circle_outline"
                @click="onAddClick('list')"
              />
            </q-item-section>
          </q-item>
          <q-scroll-area
            :style="{height: ($q.screen.height-50-16-16-50-1) / 2+'px'}"
            v-if="bookmarks"
          >
            <q-item
              v-for="bookmark in bookmarks"
              :key="bookmark.id"
              clickable
              v-ripple
              @click="selectedPam = bookmark.id"
              :active="selectedPam == bookmark.id"
              active-class="text-white bg-secondary"
            >
              <q-item-section>{{bookmark.name}}</q-item-section>
              <q-item-section side>
                <q-icon
                  name="keyboard_arrow_right"
                  :color="selectedPam == bookmark.id ? 'white' : 'green'"
                />
              </q-item-section>
            </q-item>
          </q-scroll-area>
        </q-list>
      </template>
      <template v-slot:after>
        <DashboardEmbed
          v-if="selectedPam && !showCreateAsset"
          :id.sync="selectedPam"
        />
        <CreateAsset
          v-else-if="showCreateAsset"
          @onHideShowCreateAsset="showCreateAsset = false"
          :assetType="assetType"
        />
      </template>
    </q-splitter>
  </div>
</template>

<script>
import createAsset from '@gql/createAsset.gql'
import { sync } from 'vuex-pathify'
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
      firstModel: 20,
      showCreateAsset: false,
      assetType: 'pam'
    }
  },
  computed: {
    pams: sync('pam/pams'),
    bookmarks: sync('pam/bookmarks'),
    selectedPam: sync('pam/selectedPam'),
    refreshPams: sync('pam/refreshPams'),
    refreshBookmarks: sync('pam/refreshBookmarks'),
    selectedProjectView: sync('pam/selectedProjectView')
  },
  async created () {
    await this.fetchData('pam')
    await this.fetchData('list')
    this.selectedPam = this.pams[0].id
  },
  watch: {
    async refreshPams () {
      if (this.refreshPams) {
        await this.fetchData('pam')
        this.refreshPams = false
      }
    },
    async refreshBookmarks () {
      if (this.refreshBookmarks) {
        await this.fetchData('list')
        this.refreshBookmarks = false
      }
    },
    selectedPam () {
      this.selectedProjectView = null
    }
  },
  methods: {
    onAddClick (assetType) {
      this.assetType = assetType
      this.showCreateAsset = true
    },
    async fetchData (assetType = 'pam') {
      try {
        const { data } = await this.$apollo.query({
          query: getAssetsByType,
          variables: {
            assetType
          }
        })
        switch (assetType) {
          case 'pam':
            this.pams = _.get(data, 'assets', [])
            break
          case 'list':
            this.bookmarks = _.get(data, 'assets', [])
            break
        }
      } catch (error) {
        console.error(error.message)
      }
    }
  }
}
</script>
