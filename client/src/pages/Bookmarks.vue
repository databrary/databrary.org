<template>
  <q-page padding class="max-page-width">
    <div class="q-pa-md" style="max-width: 350px">
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title>Bookmarks</q-toolbar-title>
    </q-toolbar>
      <q-list
        bordered
        separator
        v-for="(list, index) in lists"
        :key="index"
      >
        <q-item>
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            {{ list.name }}
          </q-item-section>
        </q-item>
        <q-item
          v-for="(child, cIndex) in list.children"
          :key="cIndex"
        >
          {{ child.name }}
        </q-item>
        <q-separator
          spaced
          v-if="index < (lists.length-1)"
        />
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { sync } from 'vuex-pathify'

export default {
  name: 'Bookmarks',
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    lists: sync('bookmarks/lists')
  }
}
</script>
