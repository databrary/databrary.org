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
                      <Collaborator
                        v-for="collaborator in collaborators"
                        :key="collaborator.id"
                        :ref="`collaborator-${collaborator.id}`"
                        :id="collaborator.id"
                        :permission.sync="collaborator.permission"
                        :bibliographic.sync="collaborator.bibliographic"
                        :disablePermission="collaborator.disablePermission"
                        :disableBibliographic="collaborator.disableBibliographic"
                        :disableRemove="collaborator.disableRemove"
                        @remove="onRemoveCollaborator"
                      />
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
import Collaborator from '@/components/project/modals/Collaborator'
import {
  QMarkupTable
} from 'quasar'

export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    creator: {
      type: Number,
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
    QMarkupTable,
    Collaborator
  },
  data: () => ({
    splitterModel: 25,
    limits: [25, 30],
    search: '',
    results: [],
    collaborators: [],
    loading: false
  }),
  created () {
    this.collaborators = this.data.map((el) => ({
      ...el,
      disablePermission: false,
      disableRemove: false,
      disableBibliographic: false
    }))
  },
  watch: {
    data () {
      this.collaborators = this.data.map((el) => ({
        ...el,
        disablePermission: false,
        disableRemove: false,
        disableBibliographic: false
      }))
    },
    async search () {
      await this.doSearch(this.search)
    },
    lastAdministrator (newValue, oldValue) {
      // console.log('lastAdministrator Old', oldValue)
      // console.log('lastAdministrator New', newValue)
      if (newValue) {
        newValue.disablePermission = true
        newValue.disableRemove = true
      } else if (oldValue && !newValue) {
        oldValue.disablePermission = false
        oldValue.disableRemove = oldValue.disableBibliographic
      }
    },
    lastContributor (newValue, oldValue) {
      // console.log('lastContributor Old', oldValue)
      // console.log('lastContributor New', newValue)
      if (newValue) {
        newValue.disableBibliographic = true
        newValue.disableRemove = true
      } else if (oldValue && !newValue) {
        oldValue.disableBibliographic = false
        oldValue.disableRemove = oldValue.disablePermission
      }
    }
  },
  computed: {
    lastAdministrator () {
      if (this.administratorsSize !== 1) return
      return this.collaborators.find((col) => col.permission === 'Administrator')
    },
    lastContributor () {
      if (this.contributorsSize !== 1) return
      return this.collaborators.find((col) => col.bibliographic)
    },
    contributorsSize () {
      return this.collaborators.filter((col) => col.bibliographic).length
    },
    administratorsSize () {
      return this.collaborators.filter((col) => col.permission === 'Administrator').length
    }
  },
  methods: {
    getUsersByQuery: call('search/getUsersByQuery'),
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
      this.$emit('ok', JSON.parse(JSON.stringify(
        this.collaborators.map((col) => ({
          id: col.id,
          permission: col.permission,
          bibliographic: col.bibliographic
        }))
      )))
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick () {
      // we just need to hide dialog
      this.hide()
    },

    onCollaboratorClick (collaborator) {
      if (this.collaborators.find((col) => col.id === collaborator.id)) {
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'warning',
          message: `${collaborator.displayFullName} is already a collaborator`
        })
        return
      }
      this.collaborators.push({
        id: collaborator.id,
        permission: 'Administrator',
        bibliographic: true
      })
    },

    isCreator (collaboratorId) {
      console.log('is creator', collaboratorId, this.creator)
      return collaboratorId === this.creator.toString()
    },

    onRemoveCollaborator (collaboratorId) {
      if (this.isCreator(collaboratorId)) {
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'warning',
          message: `You deleted the creator of this page.`
        })
      }
      const idx = this.collaborators.map((col) => col.id).indexOf(collaboratorId)
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
    resetDisableRemove () {
      this.collaborators.forEach((el) => { el.disableRemove = false })
    },
    resetDisablePermission () {
      this.collaborators.forEach((el) => { el.disablePermission = false })
    },
    resetDisableBibliographic () {
      this.collaborators.forEach((el) => { el.disableBibliographic = false })
    }
  }
}
</script>
