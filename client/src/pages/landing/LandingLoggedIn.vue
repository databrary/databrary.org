<template>
  <div class="q-pa-md">
    <q-splitter
      v-model="firstModel"
      :limits="[10, 30]"
    >
      <template v-slot:before>
        <q-list>
          <q-expansion-item
            expand-separator
            default-opened
          >
            <template v-slot:header>
              <q-item-section class="text-bold">
                Projects
              </q-item-section>
              <q-item-section side>
                <q-icon
                  name="add_circle_outline"
                  @click.stop="onAddClick('pam')"
                />
              </q-item-section>
            </template>
            <q-scroll-area
              :style="{height: ($q.screen.height-50-16-16-50-1) / 2+'px'}"
              v-if="pams"
            >
              <q-item
                v-for="pam in pams"
                :key="pam.id"
                clickable
                v-ripple
                @click="onClick(pam)"
                :active="pamId == pam.id"
                active-class="text-white bg-secondary"
              >
                <q-item-section>{{pam.name}}</q-item-section>
                <q-item-section side>
                  <q-icon
                    name="keyboard_arrow_right"
                    :color="pamId == pam.id ? 'white' : 'green'"
                  />
                </q-item-section>
              </q-item>
            </q-scroll-area>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            default-opened
          >
            <template v-slot:header>
              <q-item-section class="text-bold">
                Bookmarks
              </q-item-section>
              <q-item-section side>
                <q-icon
                  name="add_circle_outline"
                  @click.stop="onAddClick('list')"
                />
              </q-item-section>
            </template>
            <q-scroll-area
              :style="{height: ($q.screen.height-50-16-16-50-1) / 2+'px'}"
              v-if="bookmarks"
            >
              <q-item
                v-for="bookmark in bookmarks"
                :key="bookmark.id"
                clickable
                v-ripple
                @click="onClick(bookmark)"
                :active="bookmarkId == bookmark.id"
                active-class="text-white bg-secondary"
              >
                <q-item-section>{{bookmark.name}}</q-item-section>
                <q-item-section side>
                  <q-icon
                    name="keyboard_arrow_right"
                    :color="bookmarkId == bookmark.id ? 'white' : 'green'"
                  />
                </q-item-section>
              </q-item>
            </q-scroll-area>
          </q-expansion-item>
        </q-list>
      </template>
      <template v-slot:after>
        <div v-if="!createAssetType">
          <DashboardEmbed
            v-if="isPamSelected"
            :selected.sync="pamId"
            :refreshDashboard.sync="refreshDashboard"
          />
          <DashboardBookmark
            v-else-if="isBookmarkSelected"
            :selected.sync="bookmarkId"
            :refreshDashboard.sync="refreshDashboard"
          />
        </div>
        <CreateAsset
          v-else
          :assetType.sync="createAssetType"
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
import DashboardBookmark from '@/components/project/pam/DashboardBookmark.vue'

export default {
  name: 'LandingLoggedIn',
  components: {
    DashboardEmbed,
    DashboardBookmark,
    CreateAsset
  },
  data () {
    return {
      pams: [],
      bookmarks: [],
      firstModel: 20,
      createAssetType: null,
      pamId: null,
      bookmarkId: null,
      refreshDashboard: false
    }
  },
  computed: {
    selectedPam: sync('pam/selectedPam'),
    selectedBookmark: sync('pam/selectedBookmark'),
    refreshPams: sync('pam/refreshPams'),
    refreshBookmarks: sync('pam/refreshBookmarks'),
    isPamSelected () {
      return this.pamId !== null && this.bookmarkId == null
    },
    isBookmarkSelected () {
      return this.pamId == null && this.bookmarkId !== null
    }
  },
  async created () {
    await this.fetchData('pam')
    await this.fetchData('list')
    this.pamId = this.selectedPam ? this.selectedPam : this.pams[0].id
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
    pamId () {
      this.selectedPam = this.pamId
    },
    bookmarkId () {
      this.selectedBookmark = this.bookmarkId
    }
  },
  methods: {
    onClick (asset) {
      if (asset.assetType === 'pam') {
        this.pamId = asset.id
        this.bookmarkId = null
      } else {
        this.bookmarkId = asset.id
        this.pamId = null
      }

      this.refreshDashboard = true
    },
    onAddClick (assetType) {
      this.createAssetType = assetType
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
