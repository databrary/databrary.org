<template>
    <q-btn
        clickable
        to="/"
        @click="selectedBookmark == null ? selectedBookmark = bookmarks[0].id : null"
        dense
        flat
        class="text-weight-light text-grey-8"
    >
        <q-icon
            name="book"
            @mouseover="onDragover($event)"
            @mouseout="onLeave($event)"
            @dragover.prevent="onDragover($event)"
            @dragenter.prevent
            @dragLeave.prevent="onLeave($event)"
        />
        <q-menu
            v-model="show"
        >
            <q-list
                style="min-width: 200px"
                @dragover="onDragover($event)"
                @dragenter.prevent
                @dragleave="onLeave($event)"
            >
                <q-item
                    to="/"
                    class="text-black"
                    clickable
                    v-close-popup
                    v-for="bookmark in bookmarks"
                    :key="bookmark.id"
                    @click="selectedPam = bookmark.id"
                    @drop="onDrop($event, bookmark.id)"
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
</template>

<script>
import { sync, call } from 'vuex-pathify'
import { gql } from '@apollo/client'

import _ from 'lodash'

export default {
  data: () => ({
    show: false,
    timeout: null,
    bookmarks: []
  }),
  computed: {
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
    getAssetsByType: call('assets/getAssetsByType'),

    async fetchData () {
      try {
        const data = await this.getAssetsByType({
          assetType: 'list'
        })

        this.bookmarks = _.get(data, 'assets', [])
      } catch (error) {
        console.error(error.message)
      }
    },
    async onDrop (e, bookmarId) {
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
    onDragover (e) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      if (!this.show) {
        this.show = true
      }
    },
    onLeave (e) {
      this.timeout = setTimeout(() => {
        this.show = false
      }, 1000)
    }
  }
}
</script>

<style>

</style>
