<template>
  <div class="row">
    <q-list class="col-12">
      <Link
        class="row"
        v-for="url in urlsToShow"
        :key="url.id"
        :data="url"
      />
    </q-list>
    <q-icon
      v-if="show && urls.length > show"
      class="col-12 text-center items-center bg-grey-3 cursor-pointer"
      style="border: 1px solid #ffffff36"
      tag="div"
      size="15px"
      :name="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
      @click.stop="expanded = !expanded"
      dense
    />
  </div>
</template>

<script>
import Link from '@/components/project/Link'
export default {
  name: 'ProjectLinks',
  components: {
    Link
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    show: {
      type: Number,
      required: false,
      default: () => null
    }
  },
  data: () => ({
    urls: null,
    expanded: false
  }),
  created () {
    this.urls = this.data
  },
  watch: {
    data () {
      this.urls = this.data
    }
  },
  computed: {
    urlsToShow () {
      return this.show && !this.expanded ? this.urls.slice(0, this.show) : this.urls
    }
  }
}
</script>
