<template>
  <q-list>
    <q-expansion-item
      group="bookmarks"
      expand-separator
      default-opened
    >
      <template v-slot:header>
        <q-item-section avatar>
          <q-icon color="primary" name="art_track" />
        </q-item-section>

        <q-item-section class="text-bold">
          Views
        </q-item-section>
        <q-item-section side>
          <q-icon
            name="add_circle_outline"
            @click.stop="$emit('update:createAssetType', 'project')"
          />
        </q-item-section>
      </template>

      <q-item
        clickable
        v-ripple
        v-for="view in projects"
        :key="view.id"
        @click="$emit('update:selectedView', view.id)"
        :active="selectedView == view.id"
        active-class="bg-teal-1 text-grey-8"
        class="col-12 q-pl-md"
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

import _ from 'lodash'

import getAssetsByType from '@gql/getAssetsByType.gql'

export default {
  name: 'PageIndex',
  props: ['createAssetType', 'selectedView', 'assetId'],
  data: () => ({
    id: null,
    projects: []
  }),
  computed: {
    refreshViews: sync('pam/refreshViews')
  },
  created () {
    this.id = this.assetId
  },
  watch: {
    assetId () {
      this.id = this.assetId
    },
    async id () {
      await this.fetchData()
    },
    async refreshViews () {
      if (this.refreshViews) {
        await this.fetchData()
        this.refreshViews = false
      }
    }
  },
  methods: {
    async fetchData () {
      const { data } = await this.$apollo.query({
        query: getAssetsByType,
        variables: {
          assetId: null,
          parentId: this.assetId,
          assetType: 'project'
        }
      })

      this.projects = _.get(data, 'assets', [])
    }
  }
}
</script>
