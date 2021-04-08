<template>
  <q-dialog class="row" ref="dialog" @hide="onDialogHide">
    <q-card class="col-12 q-dialog-plugin" style="width: 100%">
      <q-splitter v-model="splitterModel">
        <template v-slot:before>
          <div class="row q-pa-md">
            <q-input
              class="col-12"
              v-model="search"
              debounce="500"
              filled
              placeholder="search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <div
              class="col-12 q-my-sm"
              v-for="funder in results"
              :key="funder.id"
            >
              <FunderCard
                class="cursor-pointer"
                :funder="funder"
                @click.native="onFunderClick(funder)"
              />
            </div>
          </div>
        </template>
        <template v-slot:after>
          <div class="row q-pa-md">
            <div class="col-12 text-h4 q-mt-sm">{{ title }}</div>
            <div class="col-12 q-mt-sm">
              <q-markup-table class="row" flat>
                <thead>
                  <tr>
                    <th class="text-left"></th>
                    <th class="text-left">Name</th>
                    <th class="text-center">Award</th>
                    <th class="text-center"></th>
                  </tr>
                </thead>
                <draggable v-model="fundings" handle=".handle" tag="tbody">
                  <tr v-for="funding in allFunding" :key="funding.id">
                    <td>
                      <q-icon class="handle" name="drag_handle" />
                    </td>
                    <td class="content-center">
                      <span class="ellipsis overflow-hidden text-no-wrap">
                        {{ funding.funder.name }}
                      </span>
                    </td>
                    <td>
                      <q-input
                        v-model="funding.award"
                        label="Award #"
                        dense
                        flat
                      />
                    </td>
                    <td class="text-center">
                      <q-icon
                        class="cursor-pointer"
                        size="sm"
                        name="delete"
                        @click.stop="onRemoveFundingClick(funding.id)"
                      />
                    </td>
                  </tr>
                </draggable>
              </q-markup-table>
            </div>
          </div>
        </template>
      </q-splitter>
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
import { uid } from 'quasar'
import _ from 'lodash'
import draggable from 'vuedraggable'
import FunderCard from '@/components/search/FunderCard'

export default {
  props: {
    data: {
      type: Array,
      required: true
    },
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
  components: {
    FunderCard,
    draggable
  },
  data: () => ({
    splitterModel: 20,
    search: '',
    results: [],
    newFundings: [],
    fundings: [],
    deleted: [],
    loading: false
  }),
  mounted () {
    this.fundings = this.data
  },
  computed: {
    allFunding () {
      return this.fundings.concat(this.newFundings)
    }
  },
  watch: {
    data: {
      deep: true,
      handler () {
        this.fundings = this.data
      }
    },
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

    onOKClick () {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok', {
        newFundings: this.newFundings,
        oldFundings: this.fundings,
        deleteFundings: this.deleted
      })
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
        this.results = _.map(hits, 'document')
        this.loading = false
      } catch (error) {
        console.log('error', error.message)
      }
    },

    onFunderClick (funder) {
      this.newFundings.push({
        id: uid(),
        award: '',
        funder: {
          id: funder.id,
          doi: funder.doi,
          name: funder.name
        }
      })
    },

    onRemoveFundingClick (fundingId) {
      const newFundingIdx = this.newFundings.findIndex(
        (f) => f.id === fundingId
      )
      if (newFundingIdx !== -1) {
        this.newFundings.splice(newFundingIdx, 1)
        return
      }

      const fundingIdx = this.fundings.findIndex((f) => f.id === fundingId)

      if (fundingIdx !== -1) {
        this.deleted = this.deleted.concat(this.fundings.splice(fundingIdx, 1))
        return
      }

      console.error(`Cannot find a funding with ${fundingId} id`)
    }
  }
}
</script>

<style scoped>
.handle {
  cursor: move;
}
</style>
