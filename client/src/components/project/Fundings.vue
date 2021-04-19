<template>
  <div class="row">
    <q-list class="col-12">
      <Funding
        class="row"
        v-for="funding in fundingsToShow"
        :key="funding.id"
        :data="funding"
      />
    </q-list>
    <q-icon
      v-if="show && fundings.length > show"
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
import Funding from '@/components/project/Funding'
export default {
  name: 'ProjectFundings',
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
  components: {
    Funding
  },
  data: () => ({
    fundings: null,
    expanded: false
  }),
  created () {
    this.fundings = this.data
  },
  watch: {
    data () {
      this.fundings = this.data
    }
  },
  computed: {
    fundingsToShow () {
      return this.show && !this.expanded ? this.fundings.slice(0, this.show) : this.fundings
    }
  }

}
</script>
