<template>
    <q-item
        v-if="link"
        class="row"
        dense
    >
        <q-item-section
            v-if="editMode"
            class="col-3"
        >
            <div class="row items-center">
                <q-icon
                    class="handle col-2"
                    name="drag_handle"
                />
                <q-select
                    class="col-8"
                    v-model="link.type"
                    :options="options"
                    dense
                    emit-value
                    map-options
                >
                    <template v-slot:option="props">
                        <q-item
                            v-bind="props.itemProps"
                            v-on="props.itemEvents"
                        >
                            <q-item-section avatar>
                                <q-avatar>
                                    <q-icon :name="props.opt.icon" />
                                </q-avatar>
                            </q-item-section>
                            <q-item-section>
                                {{props.opt.label}}
                            </q-item-section>
                        </q-item>
                    </template>
                    <template v-slot:selected-item="props">
                        <q-icon class="q-mr-sm" size="xs" :name="props.opt.icon" />
                        {{props.opt.label}}
                    </template>
                </q-select>
            </div>
        </q-item-section>
        <q-item-section v-else avatar>
          <q-avatar>
            <q-icon :name="link.type" />
          </q-avatar>
        </q-item-section>
        <q-item-section :class="editMode ? 'col-2' : 'col-4'">
          <span
            class="full-width ellipsis overflow-hidden text-no-wrap"
            :title="link.title"
          >
            {{link.title}}
          </span>
            <q-popup-edit
                v-if="editMode"
                v-model.trim="link.title"
            >
                <q-input
                    v-model.trim="link.title"
                    hint="Title"
                    dense
                    autofocus
                    counter
                />
            </q-popup-edit>
        </q-item-section>
        <q-item-section :class="editMode ? 'col-3' : 'col-4'">
          <span
            class="full-width ellipsis overflow-hidden text-no-wrap text-primary"
            style="text-decoration: underline"
            :title="link.url"
          >
            {{link.url}}
          </span>
            <q-popup-edit
                v-if="editMode"
                v-model.trim="link.url"
            >
            <q-input
                v-model.trim="link.url"
                hint="URL"
                dense
                autofocus
                counter
            />
            </q-popup-edit>
        </q-item-section>
        <q-item-section :class="editMode ? 'col-3' : 'col-4'">
          <span
            class="full-width ellipsis overflow-hidden text-no-wrap"
            :title="link.description"
          >
            {{link.description}}
          </span>
            <q-popup-edit
                v-if="editMode"
                v-model.trim="link.description"
            >
                <q-input
                    v-model.trim="link.description"
                    type='textarea'
                    hint="Description"
                    dense
                    autofocus
                    counter
                />
            </q-popup-edit>
        </q-item-section>
        <q-item-section v-if="editMode" class="col-1" right>
            <q-btn
                flat
                dense
                icon="delete"
                @click.stop="$emit('remove-link', link.id)"
            />
        </q-item-section>
      </q-item>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  data: () => ({
    link: null,
    options: [
      {
        label: 'Link',
        value: 'link',
        icon: 'link'
      },
      {
        label: 'Home Page',
        value: 'home',
        icon: 'home'
      },
      {
        label: 'Publication',
        value: 'article',
        icon: 'article'
      },
      {
        label: 'Source Code',
        value: 'source',
        icon: 'source'
      },
      {
        label: 'Dataset',
        value: 'mdi-database',
        icon: 'mdi-database'
      }
    ]
  }),
  mounted () {
    this.link = this.data
  },
  watch: {
    data () {
      this.link = this.data
    }
  }
}
</script>

<style>
.handle {
  cursor: move;
}
</style>
