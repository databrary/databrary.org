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
        <img src="../assets/databrary-logo.png" />
      </q-avatar>-->
      <h6 class="no-margin text-weight-light">
        <q-avatar size="40px">
          <img src="../assets/databrary-logo.png" />
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
    <q-btn dense flat class="text-weight-light text-grey-8 q-ma-sm" icon="notifications">
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
              <q-btn class="text-weight-regular" to="/login" exact stretch flat>
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

    <q-separator class="gt-sm" vertical inset/>

    <q-btn
      dense
      flat
      class="text-weight-light text-grey-8"
    >
      <q-avatar  size="32px">
        <img src="https://cdn.quasar.dev/img/avatar1.jpg">
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
        <q-item to="/login" clickable v-close-popup>
          <q-item-section>
            <q-item-label>
              <q-icon name="lock" class="q-pr-sm"/>Logout
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      </q-menu>
    </q-btn>
    <q-separator class="gt-sm" vertical inset/>

    <q-btn class="text-weight-light gt-sm" to="/login" exact stretch flat>Login</q-btn>
    <q-separator class="gt-sm" vertical inset/>
    <q-btn class="text-weight-light gt-sm" to="/register" exact stretch flat>Register</q-btn>
  </q-toolbar>
</template>

<script>
export default {
  methods: {
    toggleDrawer() {
      this.$emit('toggleDrawer');
    },
  },
};
</script>

<style>
</style>
