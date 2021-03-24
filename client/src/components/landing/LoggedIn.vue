<template>
  <div class="q-pa-md">
    <q-splitter
      v-model="firstModel"
      :limits="[10, 30]"
    >
      <template v-slot:before>
        <q-list>
          <ExpansionItem
            v-if="pams"
            :data.sync="pams"
            :id.sync="pamId"
            type="pam"
            :addType.sync="createAssetType"
            :height="($q.screen.height-50-16-16-50-10) / 2"
            @onClick="onClick"
          >
            Projects
          </ExpansionItem>
          <ExpansionItem
            v-if="bookmarks"
            :data.sync="bookmarks"
            :id.sync="bookmarkId"
            type="list"
            :addType.sync="createAssetType"
            :height="($q.screen.height-50-16-16-50-10) / 2"
            @onClick="onClick"
          >
            Bookmarks
          </ExpansionItem>
        </q-list>
      </template>
      <template v-slot:after>
        <div v-if="!createAssetType">
          <DashboardEmbed
            v-if="isPamSelected"
            ref="pam"
            :selected="pamId"
          />
          <DashboardBookmark
            v-else-if="isBookmarkSelected"
            ref="bookmark"
            :selected="bookmarkId"
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
import { sync } from 'vuex-pathify'

import _ from 'lodash'

import getAssetsByType from '@gql/getAssetsByType.gql'

import ExpansionItem from '@/components/shared/ExpansionItem.vue'
import CreateAsset from '@/components/pam/CreateAsset.vue'
import DashboardEmbed from '@/components/pam/DashboardEmbed.vue'
import DashboardBookmark from '@/components/pam/DashboardBookmark.vue'

export default {
  name: 'LandingLoggedIn',
  components: {
    DashboardEmbed,
    DashboardBookmark,
    CreateAsset,
    ExpansionItem
  },
  data () {
    return {
      pams: [],
      bookmarks: [],
      firstModel: 20,
      createAssetType: null,
      pamId: null,
      bookmarkId: null
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
      if (this.pamId != null) {
        this.bookmarkId = null
        this.selectedBookmark = null
        this.selectedPam = this.pamId
      }
    },
    bookmarkId () {
      if (this.bookmarkId != null) {
        this.pamId = null
        this.selectedPam = null
        this.selectedBookmark = this.bookmarkId
      }
    }
  },
  methods: {
    onClick (id, type) {
      if (type === 'pam') {
        this.pamId = id
        if (this.$refs.pam) this.$refs.pam.reset()
      } else if (type === 'list') {
        this.bookmarkId = id
        if (this.$refs.bookmark) this.$refs.bookmark.reset()
      }
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
