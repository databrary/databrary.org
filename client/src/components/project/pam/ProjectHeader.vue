<template>
  <div
    class="row"
    :style="{ height: height + 'px' }"
  >
    <q-img
      v-if="color"
      class="col-12"
      :style="{'background-color' : color}"
    >
      <q-btn
        class="float-right q-ma-md"
        rounded
        @click="color = null"
      >
        <q-avatar>
          <q-img :src="src" />
        </q-avatar>
      </q-btn>
    </q-img>
    <q-img
      v-else
      class="col-12"
      :src="src"
    >
      <q-btn
        class="float-right q-ma-md"
        rounded
        :style="{'background-color' : prevColor }"
      >
        <q-menu>
          <q-list>
            <q-item>
              <q-item-section>
                <q-color
                  flat
                  :value="color"
                  :default-value="prevColor"
                  :palette="palette"
                  @change="val => { color = val }"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-img>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      default: () => 400
    }
  },
  data: () => ({
    showEdit: false,
    color: null,
    prevColor: null,
    palette: [],
    projectId: null
  }),
  created () {
    this.projectId = this.data
  },
  watch: {
    data () {
      this.projectId = this.data
    },
    color (newVal, oldVal) {
      this.prevColor = oldVal
      if (this.palette.includes(newVal)) return
      this.palette.push(newVal)
    }
  },
  computed: {
    src () {
      return `https://picsum.photos/seed/${this.projectId}/1000/${this.height}`
    }
  }
}
</script>
