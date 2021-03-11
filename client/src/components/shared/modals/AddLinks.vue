<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="col-12 q-dialog-plugin" style="width: 180vh">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>
      <q-card-section class="row justify-between">
        <q-input
          v-model="url"
          class="col-9"
          label="URL or DOI"
          dense
        />
        <q-btn
          class="col-2"
          color="primary"
          label="Add"
          icon-right="add"
          dense
          @click="onAddClick"
        />
      </q-card-section>
      <q-card-section class="row">
        <q-list class="col-12">
          <q-item
            class="row"
            v-if="newUrl"
            dense
          >
            <q-item-section class="col-3">
                <div class="row">
                  <div class="col-2"></div>
                  <q-select
                      class="col-8"
                      v-model="newUrl.type"
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
            <q-item-section class="col-2">
              <q-input
                class="row"
                v-model.trim="newUrl.title"
                outlined
                dense
                label="Title"
              />
            </q-item-section>
            <q-item-section class="col-3 cursor-pointer">
              <q-input
                v-model.trim="newUrl.url"
                outlined dense
                label="URL"
              />
            </q-item-section>
            <q-item-section class="col-3 cursor-pointer">
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
                  @click.stop="onSaveUrlClick"
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
          <draggable v-model="urls">
            <ProjectLink
              v-for="url in urls"
              :key="url.id"
              :data="url"
              :editMode="true"
            />
          </draggable>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          dense
          color="primary"
          :label="cancelLabel"
          @click="onCancelClick"
        />
        <q-btn flat dense color="primary" :label="okLabel" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import ProjectLink from '@/components/project/shared/ProjectLink'
import { gql } from '@apollo/client'
import { uid } from 'quasar'
import draggable from 'vuedraggable'

const GET_PUBLICATION = gql`
  query GetPublication ($id: ID!) {
    publication(id: $id) {
      id
      doi,
      url,
      descriptions {
        description
      },
      titles {
        title
      }
    }
  }
`

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    okLabel: {
      type: String,
      default: () => 'OK'
    },
    cancelLabel: {
      type: String,
      default: () => 'CANCEL'
    }
  },
  components: {
    draggable,
    ProjectLink
  },
  data: () => ({
    urls: [],
    newUrl: null,
    url: '',
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
        label: 'Source',
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
    this.urls = this.data
  },
  watch: {
    data () {
      this.urls = this.data
    }
  },
  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show () {
      this.$refs.dialog.show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    onOKClick () {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok', this.urls)
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick () {
      // we just need to hide dialog
      this.hide()
    },

    async onAddClick () {
      const result = await this.parseUrl(this.url)
      this.newUrl = {
        id: uid(),
        type: result.type,
        title: result.title,
        url: result.url,
        description: result.description
      }

      this.url = ''
    },

    onSaveUrlClick () {
      if (!this.newUrl) return null

      this.urls.unshift(this.newUrl)
      this.newUrl = null
    },

    onRemoveUrlClick (id) {
      const index = this.urls.map((url) => url.id).indexOf(id)
      this.urls.splice(index, 1)
    },

    async parseUrl (url) {
      try {
        if (this.isDOI(url)) {
          url = new URL(url, 'https://doi.org/').href
          return await this.getPublication(url)
        }
      } catch (error) {
        console.error('Parsing DOI error', error.message)
      }

      return {
        type: 'link',
        title: '',
        url: this.url,
        description: ''
      }
    },

    // https://www.crossref.org/blog/dois-and-matching-regular-expressions/
    isDOI (str) {
      const re = new RegExp('^10.\\d{4,9}/[-._;()/:A-Z0-9]+$', 'i')
      return re.test(str)
    },

    async getPublication (publicationId) {
      const { data: {
        publication: {
          id,
          doi,
          url,
          titles,
          descriptions }
      } } = await this.$apollo.query({
        client: 'datacite',
        query: GET_PUBLICATION,
        variables: {
          id: publicationId
        }
      })

      return {
        id,
        doi,
        url,
        title: titles[0].title,
        description: descriptions[0].description,
        type: 'article'
      }
    }
  }
}
</script>
