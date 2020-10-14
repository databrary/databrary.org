<template>
  <q-item
    clickable
    v-ripple
    @click="setActive()"
    :active="activeList.includes(uid)"
    active-class="active"
  >
    <q-item-section>{{label}}</q-item-section>
    <q-item-section side>
      <q-icon
        name="keyboard_arrow_right"
        :color="activeList.includes(uid) ? 'white' : 'green'"
      />
    </q-item-section>
  </q-item>
</template>

<style lang="sass" scoped>
.active
  color: white
  background: $secondary
</style>

<script>
export default {
  props: ['activeList', 'click', 'level', 'label'],
  data: () => ({
    uid: null
  }),
  mounted () {
    console.log('active', this.active)
    this.uid = this._uid
  },
  methods: {
    setActive () {
      this.$emit('click')
      this.$set(this.activeList, this.level - 1, this.uid)
      for (let i = 0; i < (this.activeList.length - this.level); i++) {
        this.activeList.pop()
      }
    }
  }
}
</script>
