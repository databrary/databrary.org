<template>
    <q-avatar
        :size="size"
    >
        <img
            :src="src"
        />
    </q-avatar>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    src: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: false,
      default: () => 'md'
    }
  }
}
</script>
