<template>
  <q-layout  view="hHh lpr fFf">
    <q-header style="min-width:320px" reveal bordered>
      <navbar @toggleDrawer="toggleDrawer"/>
    </q-header>
<!--
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-item tabindex="-1" clickable tag="a" target="_blank" href="http://v1.quasar-framework.org">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>v1.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
        <q-item tabindex="-1" clickable tag="a" target="_blank" href="https://github.com/quasarframework/">
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Github</q-item-label>
            <q-item-label caption>github.com/quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item tabindex="-1" clickable tag="a" target="_blank" href="http://chat.quasar-framework.org">
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Discord Chat Channel</q-item-label>
            <q-item-label caption>chat.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
        <q-item tabindex="-1" clickable tag="a" target="_blank" href="https://forum.quasar-framework.org">
          <q-item-section avatar>
            <q-icon name="record_voice_over" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>forum.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
        <q-item tabindex="-1" clickable tag="a" target="_blank" href="https://twitter.com/quasarframework">
          <q-item-section avatar>
            <q-icon name="rss_feed" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-toolbar bordered class="databrary-footer max-page-width bg-white text-black">
      <div class="row full-width">
        <div class="text-h6 col-12">
                      <hr />

          Databrary
        </div>
        <div class="text-subtitle1 col-12">
          196 Mercer Street, Room 807 | New York, <br />NY 10012 212.998.5800
        </div>
        <div class="text-center text-subtitle1 col-12">
          Copyright &copy;2019 Databrary
        </div>
      </div>
    </q-toolbar>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar';
import navbar from '../components/navbar.vue';

export default {
  name: 'MyLayout',
  components: {
    navbar,
  },
  data() {
    return {
      leftDrawerOpen: false, // this.$q.platform.is.desktop,
    };
  },
  methods: {
    openURL,
    toggleDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
  },
};
</script>

<style>
.q-layout__section--marginal {
      background-color:#e0e0e0;
}
.databrary-footer {
  width: 100%;
}

.max-page-width {
  max-width: 1200px !important;
  margin: auto;
}
</style>
