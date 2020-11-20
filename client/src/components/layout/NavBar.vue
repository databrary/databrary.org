<template>
  <q-toolbar class="bg-white text-black">
    <!-- <q-btn
      tabindex="0"
      flat
      round
      dense
      icon="menu"
      class="q-mr-sm"
      @click="toggleDrawer"
    /> -->
    <!-- <q-separator vertical inset/> -->
    <q-btn to="/" exact stretch flat>
      <!-- <q-avatar>
        <img src="~assets/databrary-logo.png" />
      </q-avatar>-->
      <h6 class="no-margin text-weight-light">
        <q-avatar size="40px">
          <img src="~assets/databrary-logo.png" />
        </q-avatar>
        <span class="gt-xs">
          <span class="text-weight-medium">Data</span>brary
        </span>
        <span class="lt-sm">
          <span class="text-weight-medium">D</span>B
        </span>
      </h6>
    </q-btn>
    <q-separator vertical inset class="gt-sm"/>

    <q-btn class="text-weight-light gt-sm" to="/search" exact stretch flat label="Search"/>
    <q-separator vertical inset class="gt-sm"/>
    <q-btn class="text-weight-light gt-sm" to="/news" exact stretch flat label="News"/>
    <q-separator vertical inset class="gt-sm"/>
    <q-btn-dropdown class="text-weight-light gt-sm" exact stretch flat label="About">
      <q-list>
      <q-item to="/about" clickable v-close-popup>
        <q-item-section>
          <q-item-label>About The Project</q-item-label>
        </q-item-section>
      </q-item>

      <q-item to="/about/about-databrary" clickable v-close-popup>
        <q-item-section>
          <q-item-label>About Databrary</q-item-label>
        </q-item-section>
      </q-item>

      <q-item to="/about/mission" clickable v-close-popup>
        <q-item-section>
          <q-item-label>Mission</q-item-label>
        </q-item-section>
      </q-item>

      <q-item to="/about/why-share-data" clickable v-close-popup>
        <q-item-section>
          <q-item-label>Why Share mission Data</q-item-label>
        </q-item-section>
      </q-item>

      <q-item  to="/about/use-cases" clickable v-close-popup>
        <q-item-section>
          <q-item-label>Use Cases</q-item-label>
        </q-item-section>
      </q-item>

      <q-item to="/about/our-team" clickable v-close-popup>
        <q-item-section>
          <q-item-label>Our Team</q-item-label>
        </q-item-section>
      </q-item>

      <q-item to="/about/jobs" clickable v-close-popup>
        <q-item-section>
          <q-item-label>Jobs</q-item-label>
        </q-item-section>
      </q-item>

      <q-item to="/about/press-and-publications" clickable v-close-popup>
        <q-item-section>
          <q-item-label>Press and Publications</q-item-label>
        </q-item-section>
      </q-item>

      <q-item to="/about/news-letter" clickable v-close-popup>
        <q-item-section>
          <q-item-label>News Letter</q-item-label>
        </q-item-section>
      </q-item>

      <q-item to="/about/support" clickable v-close-popup>
        <q-item-section>
          <q-item-label>Support</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    </q-btn-dropdown>
    <q-space/>
    <Uploads />
    <q-btn
      v-if="isLoggedIn"
      clickable
      to="/"
      @click="selectedBookmark == null ? selectedBookmark = bookmarks[0].id : null"
      dense
      flat
      class="text-weight-light text-grey-8"
    >
      <q-icon
        name="book"
        @mouseover="onBookmarksDragover($event)"
        @mouseout="onBookmarksLeave($event)"
        @dragover="onBookmarksDragover($event)"
        @dragenter.prevent
        @dragLeave="onBookmarksLeave($event)"
      />
      <q-menu
        v-model="bookmarksShowing"
      >
        <q-list
          style="min-width: 200px"
          @dragover="onBookmarksDragover($event)"
          @dragenter.prevent
          @dragleave="onBookmarksLeave($event)"
        >
          <q-item
            to="/"
            class="text-black"
            clickable
            v-close-popup
            v-for="bookmark in bookmarks"
            :key="bookmark.id"
            @click="selectedPam = bookmark.id"
            @drop="onBookmarkListDrop($event, bookmark.id)"
          >
            <q-item-section>
              <q-item-label>
                <q-icon name="article" class="q-pr-sm"/>{{bookmark.name}}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-btn v-if="isLoggedIn" dense flat class="text-weight-light text-grey-8 q-ma-sm" icon="notifications">
      <q-badge color="red-5" floating>3</q-badge>
      <q-menu>
        <q-list>
          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Page edit</q-item-label>
              <q-item-label class="text-caption">Clair edited landing page</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator inset/>

          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Contributor added</q-item-label>
              <q-item-label class="text-caption">Clair was added to PROJECT</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator inset/>

          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Message</q-item-label>
              <q-item-label class="text-caption">Rick messaged you</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator class="gt-sm" inset/>

          <q-item to="/notifications" clickable v-close-popup class="q-pa-none">
            <q-item-section class="text-center text-grey-10">
              View all notifications
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <!-- Mobile -->
    <q-btn dense flat icon="more_vert" class="lt-md text-weight-light text-grey-8">
      <q-menu>
        <q-list>
          <q-item-label header>Navigation</q-item-label>
          <q-item clickable tabindex="0">
            <q-item-section>
              <q-btn class="text-weight-regular" to="/search" exact stretch flat label="Search"/>
              <q-btn class="text-weight-regular" to="/pages" exact stretch flat label="Pages"/>
            </q-item-section>
          </q-item>
          <q-separator inset spaced/>
          <q-item clickable tabindex="0">
            <q-item-section>
              <q-btn  class="text-weight-regular" to="/login" exact stretch flat>
                Login
              </q-btn>
              <q-btn class="text-weight-regular" to="/register" exact stretch flat>
                Register
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <q-btn-group unelevated spread v-if="isLoggedIn">
      <q-separator class="gt-sm" vertical inset/>
      <q-btn
        dense
        flat
        class="text-weight-light text-grey-8"
      >
        <q-avatar  size="32px">
          <img :src="thumbnail" >
        </q-avatar>
        <q-menu>
          <q-list style="min-width: 200px">
            <q-item to="/settings" clickable v-close-popup>
              <q-item-section>
                <q-item-label>
                  <q-icon name="settings" class="q-pr-sm"/>Account Settings
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator inset/>
            <q-item @click='onClickLogout' clickable v-close-popup>
              <q-item-section>
                <q-item-label>
                  <q-icon name="lock" class="q-pr-sm"/>Logout
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-btn-group>
    <q-btn-group unelevated spread v-if="!isLoggedIn">
      <q-separator class="gt-sm" vertical inset/>
      <q-btn
        class="text-weight-light gt-sm"
        type="a"
        v-bind:href="loginUrl"
        exact stretch flat>
        Login
      </q-btn>
      <q-separator class="gt-sm" vertical inset/>
      <q-btn
        class="text-weight-light gt-sm"
        type="a"
        href="http://localhost:8000/register"
        exact stretch flat
        >Register
      </q-btn>
    </q-btn-group>
  </q-toolbar>
</template>

<script>
import Vue from 'vue'
import { get, sync } from 'vuex-pathify'
import _ from 'lodash'
import { gql } from '@apollo/client'

import getAssetsByType from '@gql/getAssetsByType.gql'
import Uploads from './Uploads.vue'

export default {
  components: {
    Uploads
  },
  data: () => ({
    loginUrl: `http://localhost:8000/login`,
    bookmarksShowing: false,
    menuTimeout: null,
    bookmarks: []
  }),
  computed: {
    isLoggedIn: get('app/isLoggedIn'),
    thumbnail: get('app/thumbnail'),
    refreshBookmarks: sync('pam/refreshBookmarks'),
    selectedBookmark: sync('pam/selectedBookmark')
  },
  async created () {
    await this.fetchData()
  },
  watch: {
    async refreshBookmarks () {
      if (this.refreshBookmarks) {
        await this.fetchData()
        this.refreshBookmarks = false
      }
    }
  },
  methods: {
    async fetchData () {
      try {
        const { data } = await this.$apollo.query({
          query: getAssetsByType,
          variables: {
            assetType: 'list'
          }
        })

        this.bookmarks = _.get(data, 'assets', [])
      } catch (error) {
        console.error(error.message)
      }
    },
    onClickLogout () {
      // TODO(Reda): Fix this
      window.location.href = 'http://localhost:8000/logout'
    },
    toggleDrawer () {
      this.$emit('toggleDrawer')
    },
    async onBookmarkListDrop (e, bookmarId) {
      const assets = JSON.parse(e.dataTransfer.getData('children')) // TODO(jeff) necessary to originally stringify?
      const listAssets = assets.map(asset => parseInt(asset.id))

      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation UpdateBookmarkedAssets(
            $assetId: Int!, 
            $listAssets: jsonb!
          ) {
            update_assets(
              where: {
                id: {_eq: $assetId}, 
                assetType: {_eq: list}
              }, 
              _append: {listAssets: $listAssets}
            ) {
              returning {
                listAssets
              }
            }
          }
        `,
        variables: {
          assetId: bookmarId,
          listAssets: listAssets
        }
      })
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Bookmark added!'
      })
    },
    onBookmarksDragover (e) {
      if (this.menuTimeout) {
        clearTimeout(this.menuTimeout)
      }
      if (!this.bookmarksShowing) {
        this.bookmarksShowing = true
      }
      e.preventDefault()
    },
    onBookmarksLeave (e) {
      this.menuTimeout = setTimeout(() => {
        this.bookmarksShowing = false
      }, 1000)
      e.preventDefault()
    }
  }
}
</script>

<style>
</style>
