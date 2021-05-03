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
            :data="pams"
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
            :data="bookmarks"
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
          <Pam
            v-if="isPamSelected"
            ref="pam"
            :pamId="pamId"
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
          @insert-asset="onInsertAsset"
        />
      </template>
    </q-splitter>
  </div>
</template>

<script>
import { sync, call } from 'vuex-pathify'

import _ from 'lodash'

import ExpansionItem from '@/components/pam/ExpansionItem.vue'
import CreateAsset from '@/components/pam/CreateAsset.vue'
import Pam from '@/pages/Pam.vue'
import DashboardBookmark from '@/components/pam/DashboardBookmark.vue'

export default {
  name: 'LandingLoggedIn',
  components: {
    Pam,
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
      bookmarkId: null,
      showProject: false
    }
  },
  computed: {
    selectedPam: sync('pam/selectedPam'),
    selectedBookmark: sync('pam/selectedBookmark'),
    isPamSelected () {
      return this.pamId !== null && this.bookmarkId == null
    },
    isBookmarkSelected () {
      return this.pamId == null && this.bookmarkId !== null
    }
  },
  async created () {
    this.pams = await this.fetchData('pam')
    this.bookmarks = await this.fetchData('list')
    this.pamId = this.selectedPam ? this.selectedPam : this.pams[0].id
  },
  watch: {
    pamId () {
      this.showProject = false
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
    },
    selectedBookmark () {
      this.bookmarkId = this.selectedBookmark
    }
  },
  methods: {
    getAssetsByType: call('assets/getAssetsByType'),
    insertAsset: call('assets/insertAsset'),
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
        const data = await this.getAssetsByType({
          assetType
        })

        return _.get(data, 'assets', [])
      } catch (error) {
        console.error(error.message)
      }

      return []
    },

    async onInsertAsset (name, assetType) {
      try {
        const { id } = await this.insertAsset({
          parentId: null,
          name,
          assetType,
          privacyType: 'private'
        })

        if (assetType === 'pam') {
          this.pams = await this.fetchData()
          this.pamId = id
        } else if (assetType === 'list') {
          this.bookmarks = await this.fetchData('list')
          this.bookmarkId = id
        }

        setTimeout(() => {
          if (this.$refs.pam) this.$refs.pam.editDefaultTitle()
        }, 300)

        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
      } catch (error) {
        console.error('onInsertAsset::', error.message)
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Failed'
        })
      } finally {
        this.createAssetType = null
      }
    }
  }
}
</script>
