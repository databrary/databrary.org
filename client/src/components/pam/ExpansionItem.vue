<template>
  <q-expansion-item expand-separator default-opened>
    <template v-slot:header>
      <q-item-section class="text-bold">
        <slot></slot>
      </q-item-section>
      <q-item-section side>
        <q-icon
          name="add_circle_outline"
          @click.stop="$emit('update:addType', type)"
        />
      </q-item-section>
    </template>
    <div v-if="data">
      <q-scroll-area v-if="height" :style="{ height: height + 'px' }">
        <Item
          v-for="item in data"
          :key="item.id"
          :item="item"
          :active="id == item.id"
          @item-selected="onClickItem"
          @force-refresh="onForceRefresh"
        />
      </q-scroll-area>
    </div>
  </q-expansion-item>
</template>

<script>
import { sync } from 'vuex-pathify'
import Item from './Item'

export default {
  name: 'ExpansionItem',
  components: {
    Item
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    id: {
      required: true
    },
    addType: {
      required: true
    },
    type: {
      required: true
    }
  },
  computed: {
    refreshBookmarks: sync('pam/refreshBookmarks')
  },
  methods: {
    onClickItem (id) {
      this.$emit('onClick', id, this.type)
    },
    onForceRefresh () {
      if (this.type === 'list') {
        this.refreshBookmarks = true
      }
    }
  }
}
</script>
