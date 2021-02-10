<template>
  <div class="row">
    <q-list class="col-12">
      <q-item
        v-if="newUrl"
        class="row"
        dense
      >
        <q-item-section class="col-2">
          <q-input
            v-model.trim="newUrl.title"
            outlined
            dense
            label="Title"
          />
        </q-item-section>
        <q-item-section class="col-4 cursor-pointer">
          <q-input
            v-model.trim="newUrl.url"
            outlined
            dense
            label="URL"
          />
        </q-item-section>
        <q-item-section class="col-5 cursor-pointer">
          <q-input
            v-model.trim="newUrl.description"
            outlined
            dense
            label="Description"
          />
        </q-item-section>
        <q-item-section class="col-1" right>
          <div class="row">
            <q-btn
              flat
              dense
              color="positive"
              icon="check_circle"
              @click.stop="$emit('add-url', newUrl)"
            />
            <q-btn
              flat
              dense
              color="negative"
              icon="cancel"
              @click.stop="newUrl = null"
            />
          </div>
        </q-item-section>
      </q-item>
      <q-item
        :class="newUrl ? 'row non-selectable' : 'row cursor-pointer'"
        v-for="url in urlsToShow"
        :key="url.id"
        dense
      >
        <q-item-section class="col-2">
          <span class="text-capitalize">
            {{url.title}}
          </span>
          <q-popup-edit
            v-if="!newUrl"
            v-model.trim="url.title"
            @save="$emit('update-url')"
          >
            <q-input
              v-model.trim="url.title"
              hint="Title"
              dense
              autofocus
              counter
            />
          </q-popup-edit>
        </q-item-section>
        <q-item-section class="col-4">
          <span
            class="full-width ellipsis overflow-hidden text-no-wrap text-primary"
            style="text-decoration: underline"
          >
            {{url.url}}
          </span>

          <q-popup-edit
            v-if="!newUrl"
            v-model.trim="url.url"
            @save="$emit('update-url')"
          >
            <q-input
              v-model.trim="url.url"
              hint="URL"
              dense
              autofocus
              counter
            />
          </q-popup-edit>
        </q-item-section>
        <q-item-section class="col-5">
          <span
            class="full-width text-capitalize ellipsis overflow-hidden text-no-wrap"
          >
            {{url.description}}
          </span>
          <q-popup-edit
            v-if="!newUrl"
            v-model.trim="url.description"
            @save="$emit('update-url')"
          >
            <q-input
              v-model.trim="url.description"
              hint="Description"
              dense
              autofocus
              counter
            />
          </q-popup-edit>
        </q-item-section>
        <q-item-section class="col-1" right>
          <q-btn
            flat
            dense
            color="negative"
            icon="cancel"
            @click.stop="$emit('remove-url', url.id)"
          />
        </q-item-section>
      </q-item>
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
export default {
  name: 'ProjectLinks',
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
    newUrl: null,
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
  },
  methods: {
    addUrl () {
      if (this.newUrl) {
        throw new Error('You can only add one URL at a time')
      }

      this.newUrl = {
        title: '',
        url: '',
        description: ''
      }
    },
    clearNewUrl () {
      this.newUrl = null
    }
  }
}
</script>
