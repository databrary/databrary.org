<template>
  <q-item
    v-ripple
    :clickable="!edit"
    :active="active"
    active-class="text-white bg-secondary"
    @mouseenter="showEdit = true"
    @mouseleave="showEdit = false"
    @click="$emit('item-selected', id)"
  >
    <q-item-section>
        <div v-if="edit">
            <q-input
                autofocus
                dense
                v-model="name"
                @blur.prevent="onBlur"
                @keypress.enter="onEnter"
                @keydown.esc="onEsc"
            >
                <template v-slot:append>
                    <q-btn
                        flat
                        dense
                        label="SAVE"
                        :color="active ? 'white' : 'green'"
                        @click.stop="onEnter"
                    />
                </template>
            </q-input>
        </div>
        <div v-else>
            {{ name }}
        </div>
    </q-item-section>
    <q-item-section v-if="showEdit && !edit" side>
      <q-icon name="edit" :color="active ? 'white' : 'green'" @click.stop="edit = true"/>
    </q-item-section>
    <q-item-section side>
      <q-icon name="keyboard_arrow_right" :color="active ? 'white' : 'green'" />
    </q-item-section>
  </q-item>
</template>

<script>
import { call } from 'vuex-pathify'

export default {
  name: 'Item',
  props: {
    item: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    }
  },
  created () {
    this.id = this.item.id
    this.name = this.item.name
  },
  data: () => ({
    id: null,
    name: null,
    showEdit: false,
    edit: false
  }),
  methods: {
    updateAssetName: call('assets/updateAssetName'),
    onBlur () {
      this.resetName()
      this.edit = false
    },
    onEsc () {
      this.resetName()
      this.edit = false
    },
    async onEnter () {
      try {
        const { name } = await this.updateAssetName({
          name: this.name,
          assetId: this.id,
          assetType: 'pam'
        })
        this.name = name
      } catch (error) {
        this.resetName()
      } finally {
        this.edit = false
      }
    },
    resetName () {
      this.name = this.item.name
    }
  }
}
</script>
