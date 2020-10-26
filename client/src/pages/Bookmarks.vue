<template>
  <q-page padding class="max-page-width">
    <h4 class="text-weight-light no-margin q-py-md text-center">Search</h4>
    <q-list>
      <q-item-label>Bookmarks</q-item-label>
      <q-item></q-item>
    </q-list>
  </q-page>
</template>

<script>
import { sync } from 'vuex-pathify'

export default {
  name: 'Bookmarks',
  components: {
  },
  computed: {
    lists: sync('cart/lists')
  }
}
</script>
