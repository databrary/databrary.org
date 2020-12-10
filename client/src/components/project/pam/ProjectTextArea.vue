<template>
    <div
      class="relative-position"
      @mouseover="showEdit = true"
      @mouseleave="showEdit = false"
    >
      <q-btn
        v-if="showEdit"
        fab-mini
        flat
        dense
        class="absolute-right"
        icon="edit"
      >
        <q-tooltip>
          Click to edit
        </q-tooltip>
      </q-btn>
      <span>{{text}}</span>
      <q-popup-edit
        v-model="text"
        :validate="val => val.length > 0"
        @save="$emit('update-data', text)"
      >
        <template v-slot="{ initialValue, value, validate, set, cancel }">
          <q-input
            :type="type"
            v-model="text"
            :rules="[
              val => validate(value) || 'Text is required'
            ]"
            dense
            autofocus
          >
              <template v-slot:after>
                  <q-btn
                    flat
                    dense
                    color="negative"
                    icon="cancel"
                    @click.stop="cancel"
                  />
                  <q-btn
                    flat
                    dense
                    color="positive"
                    icon="check_circle"
                    @click.stop="set"
                    :disable="validate(value) === false || initialValue === value"
                  />
              </template>
          </q-input>
      </template>
    </q-popup-edit>
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
  watch: {
    data () {
      this.text = this.data
    }
  }
}
</script>
