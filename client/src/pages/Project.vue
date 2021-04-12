<template>
  <q-page padding v-if="title">
    <div class="max-page-width row">
      <section class="col-12 q-mb-sm">
        <div class="row relative-position">
          <Header
            class="col-12 fit"
            :projectId="id"
            :projectColor="color"
            :projectImageURI="imageURI"
            :projectUseImage="useImage"
            :height="400"
            @update-image-id="onUpdateImageId"
            @update-color="onUpdateColor"
            @use-image="onUseImage"
          />
          <div class="col-12 absolute-bottom">
            <TextArea
              ref="project-title"
              class="text-h5 text-white text-center q-pa-sm"
              style="background-color: rgba(0, 0, 0, 0.5)"
              :data="title"
              @update-data="onUpdateTitle"
            />
          </div>
        </div>
      </section>
      <section class="col-xs-12 col-sm-8 col-md-9">
        <TextArea
          type="textarea"
          :data="description"
          @update-data="onUpdateDescription"
        >
          Description
        </TextArea>
        <div class="q-tm-md">
          <div class="text-h5">
            Citation
          </div>
          <citationBuilder
            class="q-pa-sm"
            :data="citationBuilderData"
            :editMode="editMode"
          />
        </div>
        <div class="q-mt-md">
          <div class="text-h5">
            Collaborators
            <q-btn class="q-mx-lg" dense flat @click="onShowCollaborators">
              <q-avatar
                color="primary"
                size="sm"
                class="text-right"
                icon="add"
              />
            </q-btn>
          </div>
          <Collaborators :data="collaborators" :show="6" />
        </div>
        <div class="q-mt-md">
          <div class="text-h5">
            Funding
            <q-btn class="q-mx-lg" dense flat @click="onAddFundingClick">
              <q-avatar color="primary" size="sm" class="text-right" icon="add" />
            </q-btn>
          </div>
          <Fundings class="q-pa-sm" :data="funding" :show="3" />
        </div>
        <div class="q-mt-md">
          <div class="text-h5">
            Links
            <q-btn class="q-mx-lg" dense flat @click="onAddUrlClick">
              <q-avatar color="primary" size="sm" class="text-right" icon="add" />
            </q-btn>
          </div>
          <Links :data="urls" :show="3" />
        </div>
      </section>
      <section class="col-xs-12 col-sm-4 col-md-3">
        <div>
          <q-card class="q-px-sm" flat bordered>
            <q-list>
              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="primary" name="create" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Created on</q-item-label>
                  <q-item-label caption>{{ createdOn }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="primary" name="create" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Last Changed on</q-item-label>
                  <q-item-label caption>{{ lastChangedOn }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="primary" name="grain" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Sessions</q-item-label>
                  <q-item-label caption
                    >{{ foldersCount }} Folders -
                    {{ filesCount }} Files</q-item-label
                  >
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="primary" name="access_time" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Ages</q-item-label>
                  <q-item-label caption
                    >10.8 yrs–12.1 yrs (M = 11.5 yrs)</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="primary" name="people" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Participants</q-item-label>
                  <q-item-label caption>2 (2 Female)</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
        <div class="q-mt-md">
          <q-chip size="md" color="primary" class="q-mt-xs" v-for="i in 4" :key="i">
            Tag {{ i }}
          </q-chip>
        </div>
        <div class="q-mt-md">
          <q-markup-table flat bordered>
            <thead>
              <tr class="bg-grey-2">
                <th class="text-left">Release Level</th>
                <th># of Files</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th class="text-left bg-grey-2">private</th>
                <td class="text-center">{{ session_private }}</td>
              </tr>
              <tr>
                <th class="text-left bg-grey-2">authorized users</th>
                <td class="text-center">{{ session_authorized }}</td>
              </tr>
              <tr>
                <th class="text-left bg-grey-2">learning audiences</th>
                <td class="text-center">{{ session_audiences }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </section>
      <section class="col-12 q-mt-md">
        <FileManager :assetId="id" />
      </section>
    </div>
  </q-page>
</template>
<script>
import { date } from 'quasar'
import { call } from 'vuex-pathify'

import TextArea from '@/components/project/TextArea'
import Header from '@/components/project/Header'
import Links from '@/components/project/Links'
import Fundings from '@/components/project/Fundings'
import Collaborators from '@/components/project/Collaborators'
import CollaboratorsModal from '@/components/project/modals/Collaborators'
import AddFunding from '@/components/project/modals/AddFunding'
import AddLinks from '@/components/project/modals/AddLinks'
import FileManager from '@/components/fileManager/FileManager'
import CitationBuilder from '@/components/shared/CitationBuilder'

const defaullDescription = 'View Description'

export default {
  name: 'ProjectViewer',
  components: {
    CitationBuilder,
    FileManager,
    TextArea,
    Header,
    Links,
    AddFunding,
    AddLinks,
    Fundings,
    Collaborators,
    CollaboratorsModal
  },
  props: {
    id: {
      type: Number,
      required: false
    }
  },
  data: () => ({
    assetId: null, // asset id
    projectId: null, // project id
    title: null,
    datetimeCreated: null,
    description: null,
    lastChanged: null,
    imageId: null,
    imageURI: null,
    useImage: null,
    urls: null,
    collaborators: null,
    funding: null,
    filesCount: null,
    foldersCount: null,
    session_private: 51,
    session_authorized: 43,
    session_audiences: 336,
    // Used for the citation builder
    color: null,
    editMode: false,
    editmodeLabel: 'Edit'
  }),
  watch: {
    editMode () {
      if (!this.editMode) {
        this.editmodeLabel = 'Edit'
      } else {
        this.editmodeLabel = 'Save'
      }
    },
    async imageId () {
      const data = await this.getAssetUrl(this.imageId)
      this.imageURI = data.url
    },
    async assetId () {
      await this.fetchData()
    },
    id () {
      this.assetId = this.id || parseInt(this.$route.params.id)
    }
  },
  created () {
    this.assetId = this.id || parseInt(this.$route.params.id)
  },
  computed: {
    createdOn () {
      return date.formatDate(this.datetimeCreated, 'MM-DD-YYYY')
    },
    lastChangedOn () {
      return date.formatDate(this.lastChanged, 'MM-DD-YYYY - hh:mm A')
    },
    // TODO: Fix the citation builder data, I need to fetch metadata for every bibliographic contr
    citationBuilderData () {
      return {
        title: this.title,
        authors: this.collaborators
          .filter((col) => col.bibliographic)
          .map((col) => col.id)
          .join(', '),
        date: this.lastChanged,
        journal: 'Databrary',
        url: `https://doi.org/${this.title}`
      }
    }
  },
  methods: {
    getAssetUrl: call('assets/getAssetUrl'),
    getAssetProject: call('assets/getAssetProject'),
    updateAssetName: call('assets/updateAssetName'),
    updateProjectDescription: call('projects/updateProjectDescription'),
    updateProjectImageId: call('projects/updateProjectImageId'),
    updateProjectUseImage: call('projects/updateProjectUseImage'),
    updateProjectColor: call('projects/updateProjectColor'),
    updateProjectCollaborators: call('projects/updateProjectCollaborators'),
    insertProjectFunding: call('projects/insertProjectFunding'),
    deleteProjectFunding: call('projects/deleteProjectFunding'),
    updateProjectFunding: call('projects/updateProjectFunding'),
    getProjectFunding: call('projects/getProjectFunding'),
    updateProjectUrls: call('projects/updateProjectUrls'),
    async fetchData () {
      const data = await this.getAssetProject({
        assetId: this.assetId
      })

      const { name, datetimeCreated, project } = data.assets[0]

      this.title = name
      this.datetimeCreated = datetimeCreated
      this.projectId = project.id

      this.description = project.description || defaullDescription
      this.lastChanged = project.lastChanged

      this.filesCount = project.filesCount
      this.foldersCount = project.foldersCount
      this.color = project.color
      this.imageId = project.imageId
      this.useImage = project.useImage
      this.urls = project.urls
      this.collaborators = project.collaborators
      this.doi = project.doi
      this.funding = project.funding
    },

    async onUseImage (newUseImage) {
      const { useImage } = await this.updateProjectUseImage({
        id: this.projectId,
        useImage: newUseImage
      })
      this.useImage = useImage
    },

    async onUpdateImageId (assetId) {
      const waitForNewAssetURL = setInterval(async () => {
        try {
          console.log('onUpdateImageId')
          const newImageURI = await this.getAssetUrl(assetId)

          if (newImageURI !== null && newImageURI !== '') {
            const { useImage, imageId } = await this.updateProjectImageId({
              id: this.projectId,
              imageId: assetId
            })
            this.imageId = imageId
            this.useImage = useImage
          }
        } catch (error) {
          console.error(error.message)
        }
      }, 500)

      setTimeout(() => {
        console.log('Stop setInterval')
        clearInterval(waitForNewAssetURL)
      }, 10000)
    },

    async onUpdateColor (newColor) {
      const { color, useImage } = await this.updateProjectColor({
        id: this.projectId,
        color: newColor
      })
      this.color = color
      this.useImage = useImage
    },

    async onUpdateDescription (newDescription) {
      try {
        const {
          description,
          lastChanged
        } = await this.updateProjectDescription({
          assetId: this.assetId,
          description: newDescription
        })
        this.lastChanged = lastChanged
        this.description = description
      } catch (error) {
        console.error('onUpdateDescription::', error.message)
      }
    },

    async onUpdateTitle (newTitle) {
      try {
        console.log('Asset Id', this.assetId)
        const { name } = await this.updateAssetName({
          name: newTitle,
          assetId: this.assetId,
          assetType: 'project'
        })

        // We update the project with the same description just to change the lastChanged timestamp
        this.title = name
        // TODO: Move this workaround to a backend trigger
        const { lastChanged } = await this.updateProjectDescription({
          assetId: this.assetId,
          description: this.description
        })
        this.lastChanged = lastChanged
        this.$emit('update-project-title', this.assetId, this.title)
      } catch (error) {
        console.error('onUpdateTitle::', error.message)
      }
    },

    async onRemoveFunding (id) {
      try {
        await this.deleteProjectFunding({ id })
        this.funding.splice(
          this.funding.findIndex((el) => el.id === id),
          1
        )
      } catch (error) {
        console.error('onRemoveFunding::', error.message)
      }
    },

    async onUpdateFunding (id, award) {
      try {
        const funding = await this.updateProjectFunding({ id, award })
        const idx = this.funding.findIndex((el) => el.id === id)
        this.funding[idx] = funding
      } catch (error) {
        console.error('onUpdateFunding::', error.message)
      }
    },

    onAddFundingClick () {
      this.$q
        .dialog({
          component: AddFunding,
          parent: this,
          title: 'Funding',
          data: this.deepCopy(this.funding)
        })
        .onOk(async ({ newFundings, oldFundings, deleteFundings }) => {
          try {
            // Delete Funding
            for (const f of deleteFundings) {
              await this.deleteProjectFunding({ id: f.id })
            }

            // Add new Funding and remove generate uid
            const newInserts = newFundings.map((f) => ({
              projectId: this.projectId,
              funderId: f.funder.id,
              award: f.award
            }))
            await this.insertProjectFunding({
              object: newInserts
            })

            // Update changed fundings
            const updates = oldFundings.map((f) => ({
              id: f.id,
              projectId: this.projectId,
              funderId: f.funder.id,
              award: f.award
            }))
            await this.insertProjectFunding({
              object: updates
            })

            // Fetch Project Fundings
            this.funding = await this.getProjectFunding({
              projectId: this.projectId
            })
          } catch (error) {
            console.error('Cannot process Funding', error.message)
          }
        })
        .onCancel(() => {})
        .onDismiss(() => {})
    },

    // Qusar Dialog Plugin will sync props
    // A workarround to wait for users validation
    // is to deep copy your props
    // and wait for the ok event
    onShowCollaborators () {
      this.$q
        .dialog({
          component: CollaboratorsModal,
          parent: this,
          title: 'Collaborators',
          data: this.deepCopy(this.collaborators)
        })
        .onOk(async (newCollaborators) => {
          try {
            const { collaborators } = await this.updateProjectCollaborators({
              id: this.projectId,
              collaborators: newCollaborators
            })
            this.collaborators = collaborators
          } catch (error) {
            console.error('Cannot update collaborators', error.message)
          }
        })
        .onCancel(() => {})
        .onDismiss(() => {})
    },

    // Qusar Dialog Plugin will sync props
    // A workarround to wait for users validation
    // is to deep copy your props
    // and wait for the ok event
    onAddUrlClick () {
      this.$q
        .dialog({
          component: AddLinks,
          parent: this,
          title: 'Links',
          data: this.deepCopy(this.urls),
          okLabel: 'SAVE'
        })
        .onOk(async (links) => {
          try {
            const { urls } = await this.updateProjectUrls({
              id: this.projectId,
              urls: links
            })
            this.urls = urls
          } catch (error) {
            console.error('Cannot save urls::', error.message)
          }
        })
        .onCancel(() => {})
        .onDismiss(() => {})
    },

    deepCopy (data) {
      return JSON.parse(JSON.stringify(data))
    },

    editTitle () {
      const ref = 'project-title'
      const el = this.$refs[ref]
      if (el) {
        el.editText()
      } else {
        console.error('Cannot find element with reference', ref)
      }
    }
  }
}
</script>
