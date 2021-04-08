<template>
  <div class="row">
    <div v-if="isSlot" class="col-12 text-h5">
      <slot></slot>
    </div>
    <div
      class="col-12"
      @mouseover="showEdit = true"
      @mouseleave="showEdit = false"
    >
      <div class="row">
        <div class="col-11 q-pb-md">
          <span>{{ text }}</span>
        </div>
        <div class="col-1">
          <q-btn
            no-padding
            v-if="showEdit"
            fab-mini
            flat
            dense
            class="float-right"
            icon="edit"
          >
            <q-tooltip> Click to edit </q-tooltip>
          </q-btn>
        </div>
      </div>
      <q-popup-edit
        v-model="text"
        :validate="(val) => val.length > 0"
        @save="$emit('update-data', text)"
      >
        <template v-slot="{ initialValue, value, validate, set, cancel }">
          <q-input
            :type="type"
            v-model="text"
            :rules="[(val) => validate(value) || 'Text is required']"
            dense
            autofocus
          >
            <template v-slot:after>
              <q-btn
                flat
                dense
                color="primary"
                label="cancel"
                @click.stop="cancel"
              />
              <q-btn
                flat
                dense
                color="primary"
                label="save"
                @click.stop="set"
                :disable="validate(value) === false || initialValue === value"
              />
            </template>
          </q-input>
        </template>
      </q-popup-edit>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: () => 'text'
    }
  },
  data: () => ({
    text: '',
    showEdit: false
  }),
  mounted () {
    this.text = this.data
  },
  computed: {
    isSlot () {
      return this.$slots.default && !!this.$slots.default[0].text.length
    }
  },
  watch: {
    data () {
      this.text = this.data
    }
  }
}
</script>
