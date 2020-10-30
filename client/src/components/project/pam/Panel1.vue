<template>
  <q-list>

    <q-expansion-item
      expand-separator
      default-opened
    >
      <template v-slot:header>
        <q-item-section avatar>
          <q-icon color="primary" name="art_track" />
        </q-item-section>

        <q-item-section>
          Views
        </q-item-section>
        <q-item-section side>
            <q-icon name="add_circle_outline"  @click.stop="onShowCreateAsset"/>
        </q-item-section>
      </template>

      <q-item
        clickable
        v-ripple
        v-for="view in views"
        :key="view.id"
        @click="selectedProjectView = view.id"
        :active="selectedProjectView == view.id"
        active-class="bg-teal-1 text-grey-8"
      >
        <q-item-section avatar>
          <q-icon color="primary" name="preview" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{view.name}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<script>
import Vue from 'vue'
import { gql } from '@apollo/client'
import { sync } from 'vuex-pathify'

export default {
  name: 'PageIndex',
  data: () => ({
    projectIdFromRoute: null
  }),
  computed: {
    views: sync('pam/views'),
    selectedProjectView: sync('pam/selectedProjectView')
  },
  methods: {
    onShowCreateAsset () {
      this.$emit('onShowCreateAsset', null)
    }
  }
}
</script>
