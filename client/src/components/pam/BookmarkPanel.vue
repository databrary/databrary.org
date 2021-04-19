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
        @click="$emit('update:selectedView',view.id)"
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
    <q-expansion-item
      group="bookmarks"
      expand-separator
    >
      <template v-slot:header>
        <q-item-section avatar>
          <q-icon color="primary" name="art_track" />
        </q-item-section>

        <q-item-section class="text-bold">
          Projects
        </q-item-section>
      </template>

      <q-item
        clickable
        v-ripple
        v-for="pam in pams"
        :key="pam.id"
        @click="$emit('update:selectedPam',pam.id)"
        :active="selectedPam == pam.id"
        active-class="bg-teal-1 text-grey-8"
      >
        <q-item-section avatar>
          <q-icon color="primary" name="preview" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{pam.name}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<script>
import { gql } from '@apollo/client'
import { sync, call } from 'vuex-pathify'

import _ from 'lodash'

export default {
  name: 'BookmarkPanel',
  props: ['createAssetType', 'selectedView', 'selectedPam', 'assetId'],
  data: () => ({
    id: null,
    projects: [],
    pams: []
  }),
  computed: {
    selectedProjectView: sync('pam/selectedProjectView')
  },
  created () {
    this.id = this.assetId
  },
  watch: {
    assetId () {
      if (this.id !== this.assetId) this.id = this.assetId
    },
    async id () {
      await this.fetchData()
    }

    // async refreshViews () {
    //   if (this.refreshViews) {
    //     await this.fetchData()
    //     this.refreshViews = false
    //   }
    // }
  },
  methods: {
    getAssetsByType: call('assets/getAssetsByType'),

    async fetchData () {
      const data = await this.getAssetsByType({
        assetId: this.assetId,
        parentId: null,
        assetType: 'list'
      })

      const listAssets = _.get(data, 'assets[0].listAssets', [])

      if (_.isEmpty(listAssets)) {
        this.projects = []
        this.pams = []
        return
      }
      // TODO: (Reda) combine childAssets with the listAssets
      // ChildAssets are assets owned by the the list
      // listAssets are link to assets
      const { data: list } = await this.$apollo.query({
        query: gql`
            query GetListAssets(
              $assetId: [Int!], 
              $parentId: Int, 
              $assetType: [asset_types_enum!]!
            ) {
              assets(
                order_by: {datetimeCreated: desc}, 
                where: {
                  id: {_in: $assetId}, 
                  parentId: {_eq: $parentId}, 
                  assetType: {_in: $assetType}
                }) {
                id
                name
                datetimeCreated
                privacyType
                assetType
                listAssets
              }
            }
            `,
        variables: {
          assetId: listAssets,
          assetType: ['project', 'pam']
        }
      })
      const assets = _.get(list, 'assets', [])

      let tmpPams = []
      let tmpProjects = []

      for (const asset of assets) {
        if (asset.assetType === 'pam') tmpPams.push(asset)
        if (asset.assetType === 'project') tmpProjects.push(asset)
      }

      this.pams = tmpPams
      this.projects = tmpProjects
    }
  }

}
</script>
