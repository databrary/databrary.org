<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card
      class="col-12 q-dialog-plugin"
      style="display: block; width: 70%; min-height: 500px; height: 500px"
    >
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>
      <q-card-section class="row justify-between">
        <q-input
          v-model="url"
          class="col-9"
          label="URL or DOI"
          dense
          @keypress.enter="onAddClick"
          autofocus
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
      <q-card-section class="row" style="height: 330px">
        <q-scroll-area class="col-12" style="height: 300px">
          <q-list class="row">
            <draggable
              handle=".handle"
              v-model="urls"
              class="col-12"
            >
              <Link
                v-for="url in urls"
                :key="url.id"
                :ref="`link-${url.id}`"
                :data="url"
                :editMode="true"
                @remove-link="onRemoveUrlClick"
              />
            </draggable>
          </q-list>
        </q-scroll-area>
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
import Link from '@/components/project/Link'
import { gql } from '@apollo/client'
import { uid } from 'quasar'
import draggable from 'vuedraggable'

const GET_PUBLICATION = gql`
  query GetPublication($id: ID!) {
    publication(id: $id) {
      id
      doi
      url
      descriptions {
        description
      }
      titles {
        title
      }
    }
  }
`

export default {
  name: 'AddLinks',
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
    Link
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
      const newUrl = {
        id: uid(),
        type: result.type,
        title: result.title,
        url: result.id,
        description: result.description
      }
      this.urls.unshift(newUrl)
      this.url = ''
      setTimeout(() => {
        if (!newUrl.title) {
          this.getLinkFromRef(`link-${newUrl.id}`)
        }
      }, 100)
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
      let formattedUrl = url
      if (this.isValidDOI(url)) {
        formattedUrl = new URL(formattedUrl, 'https://doi.org/').href
      }

      try {
        if (formattedUrl.includes('https://doi.org/')) {
          const publication = await this.getPublication(formattedUrl)
          return publication
        }
      } catch (error) {
        console.error(`Parsing DOI ${formattedUrl} error`, error.message)
      }

      if (!this.containsProtocol(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl
      }

      if (this.isValidURL(formattedUrl)) {
        return {
          type: 'link',
          title: '',
          url: formattedUrl,
          id: formattedUrl,
          description: ''
        }
      }
      return {
        type: 'link',
        title: '',
        url: url,
        id: url,
        description: ''
      }
    },

    // https://www.crossref.org/blog/dois-and-matching-regular-expressions/
    isValidDOI (str) {
      const re = new RegExp('^10.\\d{4,9}/[-._;()/:A-Z0-9]+$', 'i')
      return re.test(str)
    },
    // https://stackoverflow.com/questions/8667070/javascript-regular-expression-to-validate-url
    isValidURL (str) {
      const re = new RegExp('^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\\.(?:[a-z\u00a1-\uffff]{2,})))(?::\\d{2,5})?(?:[/?#]\\S*)?$', 'i')
      return re.test(str)
    },

    containsProtocol (str) {
      const re = new RegExp('^(?:(?:(?:https?|ftp):)?\\/\\/)', 'i')
      return re.test(str)
    },

    async getPublication (publicationId) {
      const {
        data: {
          publication: { id, doi, url, titles, descriptions }
        }
      } = await this.$apollo.query({
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
    },

    getLinkFromRef (ref) {
      const el = this.$refs[ref]
      if (el) {
        el[0].editTitle()
      } else {
        console.error('Cannot find element with reference', ref)
      }
    }
  }
}
</script>
