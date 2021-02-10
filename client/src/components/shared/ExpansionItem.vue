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
        <q-item
          v-for="item in data"
          :key="item.id"
          clickable
          v-ripple
          @click="onClickItem(item.id)"
          :active="id == item.id"
          active-class="text-white bg-secondary"
        >
          <q-item-section>{{ item.name }}</q-item-section>
          <q-item-section side>
            <q-icon
              name="keyboard_arrow_right"
              :color="id == item.id ? 'white' : 'green'"
            />
          </q-item-section>
        </q-item>
      </q-scroll-area>
      <q-item
        v-else
        v-for="item in data"
        :key="item.id"
        clickable
        v-ripple
        @click="$emit('update:id', item.id)"
        :active="id == item.id"
        active-class="text-white bg-secondary"
      >
        <q-item-section>{{ item.name }}</q-item-section>
        <q-item-section side>
          <q-icon
            name="keyboard_arrow_right"
            :color="id == item.id ? 'white' : 'green'"
          />
        </q-item-section>
      </q-item>
    </div>
  </q-expansion-item>
</template>

<script>
export default {
  name: 'ExpansionItem',
  props: {
    data: {
      type: Array,
      required: true
    },
    height: {
      type: Number
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
  methods: {
    onClickItem (id) {
      this.$emit('onClick', id, this.type)
    }
  }
}
</script>
