<template>
  <q-toolbar class="bg-white text-black">
    <q-btn to="/" exact stretch flat>
      <h6 class="no-margin text-weight-light">
        <q-avatar size="32px">
          <img src="~assets/databrary-logo.png" />
        </q-avatar>
        <span class="gt-xs">
          <span class="text-capitalize">
            <span class="text-weight-medium">Data</span>brary
          </span>
        </span>
        <span class="lt-sm">
          <span class="text-weight-medium">D</span>B
        </span>
      </h6>
    </q-btn>

    <q-separator vertical inset class="gt-sm"/>

    <q-btn
      class="text-weight-light gt-sm"
      to="/search"
      exact
      stretch
      flat
      label="Search"
    />

    <q-separator vertical inset class="gt-sm"/>

    <q-btn
      class="text-weight-light gt-sm"
      to="/news"
      exact
      stretch
      flat
      label="News"
    />

    <q-separator vertical inset class="gt-sm"/>

    <q-btn-dropdown
      class="text-weight-light gt-sm"
      exact
      stretch
      flat
      label="About"
    >
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

    <Uploads v-if="isLoggedIn" class="q-mx-sm"/>
    <Bookmarks v-if="isLoggedIn" class="q-mx-sm"/>
    <Notifications v-if="isLoggedIn" class="q-mx-sm"/>

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
          <q-separator v-if="!isLoggedIn" inset spaced/>
          <q-item v-if="!isLoggedIn" clickable tabindex="0">
            <q-item-section>
              <q-btn  class="text-weight-regular" :href="loginUrl" exact stretch flat>
                Login
              </q-btn>
              <q-btn class="text-weight-regular" :href="registerUrl" exact stretch flat>
                Register
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <q-btn-group
      v-if="isLoggedIn"
      unelevated
      spread
      class="q-ml-sm"
    >
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

    <q-btn-group
      v-if="!isLoggedIn"
      unelevated
      spread
    >
      <q-separator class="gt-sm" vertical inset/>

      <q-btn
        class="text-weight-light gt-sm"
        type="a"
        :href="loginUrl"
        exact stretch flat
      >
        Login
      </q-btn>

      <q-separator class="gt-sm" vertical inset/>

      <q-btn
        class="text-weight-light gt-sm"
        type="a"
        :href="registerUrl"
        exact stretch flat
      >
        Register
      </q-btn>
    </q-btn-group>

  </q-toolbar>
</template>

<script>
import Vue from 'vue'
import { get } from 'vuex-pathify'

import Uploads from './Uploads.vue'
import Bookmarks from './Bookmarks.vue'
import Notifications from './Notifications.vue'

export default {
  components: {
    Uploads,
    Bookmarks,
    Notifications
  },
  data: () => ({
    loginUrl: `http://localhost:8000/login`,
    registerUrl: `http://localhost:8000/register`
  }),
  computed: {
    isLoggedIn: get('app/isLoggedIn'),
    thumbnail: get('app/thumbnail')
  },
  methods: {
    onClickLogout () {
      window.location.href = 'http://localhost:8000/logout'
    }
  }
}
</script>

<style>
</style>
