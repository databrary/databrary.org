<template>
  <q-dialog
    class="row"
    ref="dialog"
    @hide="onDialogHide"
  >
    <q-card
      class="col-12 q-dialog-plugin"
      style="display: block; width: 70%; min-height: 500px; height: 500px"
    >
      <q-card-section class="row" style="height: 445px">
        <q-splitter
          class="col-12"
          v-model="splitterModel"
          :limits="limits"
        >
          <template v-slot:before>
            <div class="row q-pa-md">
              <q-input
                ref="searchInput"
                class="col-12"
                v-model="search"
                debounce="500"
                autofocus
                filled
                placeholder="Search"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-scroll-area class="col-12 q-mt-sm" style="height: 350px">
                <ProfileCard
                  v-for="doc in results"
                  :key="doc.id"
                  class="q-my-sm cursor-pointer"
                  :profile="doc"
                  @click.native="onCollaboratorClick(doc)"
                />
              </q-scroll-area>
            </div>
          </template>

          <template v-slot:after>
            <div class="row q-pa-md">
              <div class="col-12 text-h4 q-mt-sm">{{ title }}</div>
              <div class="col-12">
                <div class="row">
                  <q-markup-table class="col-12" flat>
                    <thead>
                      <tr>
                        <th class="text-left"></th>
                        <th class="text-left">Name</th>
                        <th class="text-center">Permissions</th>
                        <th class="text-center">Bibliographic Contributor</th>
                        <th class="text-center"></th>
                      </tr>
                    </thead>
                    <draggable
                      v-model="collaborators"
                      tag="tbody"
                    >
                      <tr
                        v-for="collaborator in collaborators"
                        :key="collaborator.id">
                        <td>
                          <q-icon name="drag_handle"/>
                        </td>
                        <td>
                          <div class="row items-center">
                            <q-avatar
                              class="q-mr-md"
                              size="md"
                            >
                              <img
                                v-if="collaborator.useGravatar"
                                :src="JSON.parse(collaborator.gravatar).large"
                              />
                              <img
                                v-else
                                :src="JSON.parse(collaborator.image).large"
                              />
                            </q-avatar>
                            {{ collaborator.displayFullName }}
                          </div>
                        </td>
                        <td class="text-center">
                          <q-select
                            class="fit"
                            dense
                            item-aligned
                            v-model="collaborator.permission"
                            :options="permissions"
                          />
                        </td>
                        <td class="text-center">
                          <q-checkbox v-model="collaborator.bibliographic" />
                        </td>
                        <td class="text-center">
                          <q-icon
                            size="sm"
                            name="delete"
                            @click.stop="onRemoveCollaborator(collaborator)"
                          />
                        </td>
                      </tr>
                    </draggable>
                  </q-markup-table>
                </div>
              </div>
            </div>
          </template>
        </q-splitter>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat color="primary" :label="cancelLabel" @click="onCancelClick" />
        <q-btn flat color="primary" :label="okLabel" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { call } from 'vuex-pathify'
import draggable from 'vuedraggable'
import ProfileCard from '@/components/search/ProfileCard'
import {
  QMarkupTable
} from 'quasar'

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
    ProfileCard,
    draggable,
    QMarkupTable
  },
  data: () => ({
    splitterModel: 25,
    limits: [25, 30],
    search: '',
    results: [],
    collaborators: [],
    loading: false,
    permissions: [
      {
        label: 'Administrator',
        value: 'administrator'
      },
      {
        label: 'Manager',
        value: 'manager'
      },
      {
        label: 'Read & Write',
        value: 'read_write'
      },
      {
        label: 'Read',
        value: 'read'
      }
    ]
  }),
  async created () {
    this.collaborators = await this.generateCollaborators()
  },
  watch: {
    async data () {
      this.collaborators = await this.generateCollaborators()
    },
    async search () {
      await this.doSearch(this.search)
    }
  },
  methods: {
    getUsersByQuery: call('search/getUsersByQuery'),
    getUserById: call('search/getUserById'),
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
      const colls = this.collaborators.map((el) => ({
        id: el.id,
        permission: el.permission,
        bibliographic: el.bibliographic
      }))
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok', JSON.parse(JSON.stringify(colls)))
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick () {
      // we just need to hide dialog
      this.hide()
    },

    onCollaboratorClick (collaborator) {
      if (this.collaborators.find((col) => col.id === collaborator.id)) return
      this.collaborators.push({
        ...collaborator,
        permission: 'Administrator',
        bibliographic: true
      })
    },

    onRemoveCollaborator (collaborator) {
      const idx = this.collaborators.map((col) => col.docId).indexOf(collaborator.docId)
      this.collaborators.splice(idx, 1)
    },

    async doSearch (query) {
      try {
        this.loading = true
        this.results = await this.getUsersByQuery({
          query
        })
        this.loading = false
      } catch (error) {
        console.log('error', error.message)
      }
    },

    async generateCollaborators () {
      const collaborators = []
      for (const col of this.data) {
        if (!col.id) continue
        const userDoc = await this.getUserById({ id: col.id })
        collaborators.push({
          ...userDoc,
          permission: col.permission,
          bibliographic: col.bibliographic
        })
      }

      return collaborators
    }
  }
}
</script>
