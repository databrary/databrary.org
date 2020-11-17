<template>
  <div
    class="row justify-start items-center cursor-pointer"
  >
    <q-icon
      class="col-2"
      size="sm"
      :name="icon"
    />
    <q-input
      v-if="edit"
      v-model.trim="inputName"
      class="col-10"
      dense
      autofocus
      type="text"
      hide-bottom-space
      :bottom-slots="false"
      :error-message="errorMessage"
      :error="error"
      @focus="$event.target.select()"
      @keydown.esc="onEscEvent()"
      @keydown.enter="onEnterEvent()"
      @blur.prevent="onBlurEvent()"
    />
    <span
      v-else
      class="col-10"
    >
      {{name}}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    edit: {
      type: Boolean,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    errorMessage: {
      required: true
    }
  },
  data: () => ({
    inputName: null
  }),
  mounted () {
    this.inputName = this.name
  },
  computed: {
    error () {
      return this.errorMessage != null
    }
  },
  watch: {
    inputName () {
      if (!this.edit) return
      this.$emit('validate', this.inputName)
      this.$emit('update:name', this.inputName)
    }
  },
  methods: {
    onEnterEvent () {
      if (this.error) return
      this.$emit('save')
      this.setEdit(false)
    },

    onEscEvent () {
      this.reset()
      setTimeout(() => {
        this.$emit('save')
        this.setEdit(false)
      }, 100)
    },

    // // FIXME: (Reda) cannot save on blur event; causing conflict with discard dialog
    onBlurEvent (node) {
      if (this.error) return
      this.setEdit(false)
    },
    setEdit (edit) {
      this.$emit('update:edit', edit)
    },
    reset () {
      this.$emit('reset')
    }
  }

}
</script>
