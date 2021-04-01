<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card style="width: 600px" class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">{{title}}</div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="search"
          debounce="500"
          filled
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section  style="height: 500px">
        <div v-if="loading">
          <q-item v-for="i in Array(5).keys()" :key="i">
            <q-item-section>
              <q-item-label>
                <q-skeleton type="text" width="35%" />
              </q-item-label>
              <q-item-label caption>
                <q-skeleton type="text" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <q-scroll-area v-else class="fit">
          <q-item v-for="funder in results" :key="funder.id">
            <q-item-section>
              <q-item-label>
                <span>{{funder.name}}</span>
              </q-item-label>
              <q-item-label caption>
                <span>{{funder.doi}}</span>
              </q-item-label>
              <q-item-label lines="1" v-if="funder.awards.length">
                <div
                  v-for="award in funder.awards"
                  :key="award.id"
                >
                  <q-input
                    v-model="award.value"
                    class="col-12"
                    dense
                    label="Award #"
                    mask="XXX-XXXXXX-XX"
                    hint="XXX-XXXXXX-XX"
                  >
                    <template append>
                      <q-btn
                        flat
                        dense
                        color="negative"
                        icon="cancel"
                        @click.stop="onRemoveAwardClick (award.id, funder)"
                      />
                    </template>
                  </q-input>
                </div>
              </q-item-label>
            </q-item-section>
            <q-item-section top side>
              <q-btn
                flat
                dense
                icon="add_circle_outline"
                @click.stop="onAddAwardClick(funder)"
              />
            </q-item-section>
          </q-item>
        </q-scroll-area>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat dense color="primary" :label="cancelLabel" @click="onCancelClick" />
        <q-btn flat dense color="primary" :label="okLabel" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { uid } from 'quasar'
import _ from 'lodash'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    okLabel: {
      type: String,
      default: () => 'SAVE'
    },
    cancelLabel: {
      type: String,
      default: () => 'CANCEL'
    }
  },
  data: () => ({
    search: '',
    results: [],
    loading: false,
    client: null
  }),
  watch: {
    async search () {
      await this.dataCiteFundersLookUp(this.search)
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

    hasAwards (funder) {
      if (!funder.awards) return false

      return !funder.awards.every((award) => award.value === '')
    },

    onOKClick () {
      const funding = this.results
        .filter((funder) => this.hasAwards(funder))
        .map(({ id, doi, name, awards }) => ({
          id: id,
          doi: doi,
          name: name,
          awards: awards.filter((award) => award.value !== '')
        }))
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok', funding)
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick () {
      // we just need to hide dialog
      this.hide()
    },

    async dataCiteFundersLookUp (query) {
      try {
        this.loading = true
        const { hits } = await this.$typesense
          .collections(['databrary-funders'])
          .documents()
          .search({
            q: query,
            query_by: 'name'
          })
        this.results = _.map(hits, 'document').map(({ id, doi, name }) => (
          {
            id,
            doi,
            name,
            awards: []
          }
        ))
        this.loading = false
      } catch (error) {
        console.log('error', error.message)
      }
    },

    onAddAwardClick (funder) {
      if (funder.awards.find((el) => el.value === '')) return
      funder.awards.push({ id: uid(), value: '' })
    },

    onRemoveAwardClick (id, funder) {
      funder.awards = funder.awards.filter((award) => award.id !== id)
    }
  }
}
</script>
