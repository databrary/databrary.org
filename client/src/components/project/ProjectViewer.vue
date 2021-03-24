<template>
  <q-page padding v-if="title">
    <div class="max-page-width row">
      <div class="col-12 q-mb-sm">
        <div class="row relative-position">
          <ProjectHeader
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
          <ProjectTextArea
            class="col-12 absolute-bottom text-h5 text-white text-center q-pa-md"
            style="background-color: rgba(0, 0, 0, 0.5)"
            :data="title"
            @update-data="onUpdateTitle"
          />
        </div>
      </div>
      <div class="col-xs-12 col-sm-8 col-md-9">
        <div class="row">
          <div class="col-12 text-h5 q-mt-md">
            Description
          </div>
          <ProjectTextArea
            class="col-12 text-body1 q-pa-sm"
            type="textarea"
            :data="description"
            @update-data="onUpdateDescription"
          />
        </div>
        <q-chip
          square
          size="md"
          class="q-mt-xs"
          v-for="i in 4"
          :key="i"
        >
          <q-avatar
            color="primary"
            text-color="black"
          >1</q-avatar>
          Tag {{i}}
        </q-chip>
        <div class="text-h5 q-mt-md">
          Citation
        </div>
        <citationBuilder
          class="q-pa-sm"
          :data="citationBuilderData"
          :editMode="editMode"
        />
        <div class="q-mt-md">
          <div class="text-h5 float-left">
            Collaborators
            <q-btn
              class="q-mx-lg"
              dense
              flat
              @click="onShowCollaborators"
            >
              <q-avatar
                color="primary"
                size="sm"
                class="text-right"
                icon="add"
              />
            </q-btn>
            <ProjectCollaborators
              :data="collaborators"
              :show="6"
            />
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-4 col-md-3">
        <q-card
          class="q-px-sm"
          flat
          bordered
        >
          <q-list>
            <q-item clickable>
              <q-item-section avatar>
                <q-icon
                  color="primary"
                  name="create"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>Created on</q-item-label>
                <q-item-label caption>{{ createdOn }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon
                  color="primary"
                  name="create"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>Last Changed on</q-item-label>
                <q-item-label caption>{{ lastChangedOn }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon
                  color="primary"
                  name="grain"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>Sessions</q-item-label>
                <q-item-label caption>{{foldersCount}} Folders - {{filesCount}} Files</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section avatar>
                <q-icon
                  color="primary"
                  name="access_time"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>Ages</q-item-label>
                <q-item-label caption>10.8 yrs–12.1 yrs (M = 11.5 yrs)</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section avatar>
                <q-icon
                  color="primary"
                  name="people"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>Participants</q-item-label>
                <q-item-label caption>2 (2 Female)</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
      <div class="q-mt-md col-xs-12 col-sm-8 col-md-9">
        <div class="row text-h5 q-mt-md">
          Funding
          <q-btn
            class="q-mx-lg"
            dense
            flat
            @click="onAddFundingClick"
          >
            <q-avatar
              color="primary"
              size="sm"
              class="text-right"
              icon="add"
            />
          </q-btn>
          <ProjectFunding
            class="col-12 q-pa-sm"
            :data="funding"
            @remove-funding="onRemoveFunding"
            @update-funding="onUpdateFunding"
          />
        </div>
        <div class="row text-h5 q-mt-md">
          Links
          <q-btn
            class="q-mx-lg"
            dense
            flat
            @click="onAddUrlClick"
          >
            <q-avatar
              color="primary"
              size="sm"
              class="text-right"
              icon="add"
            />
          </q-btn>
        </div>
        <div class="row">
          <ProjectLinks
            class="col-12"
            :data="urls"
            :show="3"
          />
        </div>
      </div>
      <div class="q-mt-md col-xs-12 col-sm-8 col-md-9">
        <div class="row text-h5 q-mt-md">
          File Release Levels
        </div>
        <q-item class="row justify-content-left">
          <div class="q-pa-md">
            <q-markup-table
              flat
              bordered
            >
              <thead>
                <tr class="bg-grey-4">
                  <th>File Type</th>
                  <th class="text-left">Release Level</th>
                  <th># of Files</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th class="bg-grey-4" rowspan="3">sessions</th>
                  <th class="text-left bg-grey-4">private</th>
                  <td class="text-center">{{ session_private }}</td>
                </tr>
                <tr>
                  <th class="text-left bg-grey-4">authorized users</th>
                  <td class="text-center">{{ session_authorized }}</td>
                </tr>
                <tr>
                  <th class="text-left bg-grey-4">learning audiences</th>
                  <td class="text-center"> {{ session_audiences }} </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </q-item>
      </div>
      <div class="col-12">
        <FileManager :assetId="assetId" />
      </div>
    </div>
  </q-page>
</template>
<script>
import { date } from 'quasar'
import { gql } from '@apollo/client'
import { call } from 'vuex-pathify'

import CitationBuilder from '@/components/shared/CitationBuilder'
import AddFunding from '@/components/shared/modals/AddFunding'
import AddLinks from '@/components/shared/modals/AddLinks'
import FileManager from '@/components/fileManager/FileManager'
import ProjectTextArea from '@/components/project/ProjectTextArea'
import ProjectHeader from '@/components/project/ProjectHeader'
import ProjectLinks from '@/components/project/ProjectLinks'
import ProjectFunding from '@/components/project/ProjectFunding'
import ProjectCollaborators from '@/components/project/ProjectCollaborators'
import Collaborators from '@/components/shared/modals/Collaborators'

const defaullDescription = 'View Description'

export default {
  name: 'ProjectViewer',
  components: {
    CitationBuilder,
    FileManager,
    ProjectTextArea,
    ProjectHeader,
    ProjectLinks,
    AddFunding,
    AddLinks,
    ProjectFunding,
    ProjectCollaborators,
    Collaborators
  },
  props: {
    assetId: {
      type: Number,
      required: false
    }
  },
  data: () => ({
    id: null, // project id
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
    'assetId': 'fetchData'
  },
  async created () {
    this.assetId = this.assetId || parseInt(this.$route.params.id)
    this.fetchData()
  },
  computed: {
    createdOn () {
      return date.formatDate(this.datetimeCreated, 'MM-DD-YYYY')
    },
    lastChangedOn () {
      return date.formatDate(this.lastChanged, 'MM-DD-YYYY - hh:mm A')
    },
    citationBuilderData () {
      return {
        title: this.title,
        authors: this.collaborators
          .filter(col => col.bibliographic)
          .map((col) => col.displayFullName).join(', '),
        date: this.lastChanged,
        journal: 'Databrary',
        url: `https://doi.org/${this.title}`
      }
    }
  },
  methods: {
    getAssetUrl: call('assets/getAssetUrl'),
    async fetchData () {
      const result = await this.$apollo.query({
        query: gql`
          query GetProject($assetId: Int!) {
            assets(where: {
              id: {_eq: $assetId},
              assetType: {_eq: project}
            }) {
              name
              datetimeCreated
              project {
                id
                description
                lastChanged
                color
                filesCount
                foldersCount
                imageId
                useImage
                urls
                collaborators
                doi
                funding {
                  id
                  funder {
                    name
                    doi
                  }
                  awards
                }
              }
            }
          }
        `,
        variables: {
          assetId: this.assetId
        }
      })

      const { name, datetimeCreated, project } = result.data.assets[0]

      this.title = name
      this.datetimeCreated = datetimeCreated

      this.description = project.description || defaullDescription
      this.id = project.id
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
    async updateAssetName (newName) {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation UpdateAssetName($assetId: Int!, $name: String!) {
            update_assets(
                where: {id: {_eq: $assetId}, assetType: {_eq: project}}, 
                _set: {name: $name}
            ) {
              returning {
                name
              }
            }
          }
        `,
        variables: {
          assetId: this.assetId,
          name: newName
        }
      })

      return data.update_assets.returning[0]
    },
    async updateProject (description) {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation UpdateProject($assetId: Int!, $description: String!) {
            update_projects(
              where: {assetId: {_eq: $assetId}}, 
              _set: {description: $description, lastChanged: "now()"}
            ) {
              returning {
                description
                lastChanged
              }
            }
          }
        `,
        variables: {
          assetId: this.assetId,
          description: description
        }
      })

      return data.update_projects.returning[0]
    },
    async updateImageId (assetId) {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation UpdateImageId($id: Int!, $imageId: Int!) {
            update_projects(
              where: {id: {_eq: $id}}, 
              _set: {imageId: $imageId, useImage: "true"}
            ) {
              returning {
                imageId
                useImage
              }
            }
          }
        `,
        variables: {
          id: this.id,
          imageId: assetId
        }
      })
      return data.update_projects.returning[0]
    },

    async updateUseImage (useImage) {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation UpdateProjectUseImage($id: Int!, $useImage: Boolean!) {
            update_projects(
              where: {id: {_eq: $id}},
              _set: {useImage: $useImage}
            ) {
              returning {
                useImage
              }
            }
          }
        `,
        variables: {
          id: this.id,
          useImage: useImage
        }
      })
      return data.update_projects.returning[0]
    },
    async updateColor (color) {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation UpdateProjectColor($id: Int!, $color: String!) {
            update_projects(
              where: {id: {_eq: $id}}, 
              _set: {color: $color, useImage: "false"}
            ) {
              returning {
                color
                useImage
              }
            }
          }
        `,
        variables: {
          id: this.id,
          color: color
        }
      })

      return data.update_projects.returning[0]
    },

    async updateUrls (urls) {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation UpdateProjectUrls($id: Int!, $urls: jsonb!) {
            update_projects(
              where: {id: {_eq: $id}}, 
              _set: {urls: $urls}
            ) {
                returning {
                  urls
                }
              }
          }
        `,
        variables: {
          id: this.id,
          urls: urls
        }
      })

      return data.update_projects.returning[0]
    },

    async updateCollaborators (collaborators) {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation UpdateProjectCollaborators($id: Int!, $collaborators: jsonb!) {
            update_projects(
              where: {id: {_eq: $id}}, 
              _set: {collaborators: $collaborators}
            ) {
                returning {
                  collaborators
                }
              }
          }
        `,
        variables: {
          id: this.id,
          collaborators: collaborators
        }
      })

      return data.update_projects.returning[0].collaborators
    },

    async insertFunding (fundings) {
      const that = this
      const mutationObject = fundings.map((funding) => (
        {
          projectId: that.id,
          funderId: funding.id,
          awards: funding.awards
        }
      ))
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation InsertFunding(
            $object: [projects_funding_insert_input!]!
          ) {
            insert_projects_funding(
              objects: $object
            ) {
              returning {
                id
                funder {
                  name
                  doi
                }
                awards
              }
            }
          }
        `,
        variables: {
          object: mutationObject
        }
      })

      return data.insert_projects_funding.returning[0]
    },

    async removeFunding (id) {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation DeleteFunding($id: Int!) {
            delete_projects_funding_by_pk(id: $id) {
              id
            }
          }
        `,
        variables: {
          id: id
        }
      })

      return data.delete_projects_funding_by_pk.id
    },

    async updateFunding (id, awards) {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation UpdateFunding(
            $id: Int!,
            $awards: jsonb!
          ) {
            update_projects_funding_by_pk(
              pk_columns: {id: $id}, 
              _set: {awards: $awards}
            ) {
              id
              funder {
                name
                doi
              }
              awards
            }
          }
        `,
        variables: {
          id: id,
          awards: awards
        }
      })

      return data.update_projects_funding_by_pk
    },

    async onUseImage (newUseImage) {
      const { useImage } = await this.updateUseImage(newUseImage)
      this.useImage = useImage
    },

    async onUpdateImageId (assetId) {
      const waitForNewAssetURL = setInterval(async () => {
        try {
          console.log('onUpdateImageId')
          const newImageURI = await this.getAssetUrl(assetId)

          if (newImageURI !== null && newImageURI !== '') {
            const { useImage, imageId } = await this.updateImageId(assetId)
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
      const { color, useImage } = await this.updateColor(newColor)
      this.color = color
      this.useImage = useImage
    },

    async onUpdateDescription (newDescription) {
      try {
        const { description, lastChanged } = await this.updateProject(newDescription)
        this.lastChanged = lastChanged
        this.description = description
      } catch (error) {
        console.error('onUpdateDescription::', error.message)
      }
    },

    async onUpdateTitle (newTitle) {
      try {
        const { name } = await this.updateAssetName(newTitle)
        // We update the project with the same description just to change the lastChanged timestamp
        this.title = name
        const { lastChanged } = await this.updateProject(this.description)
        this.lastChanged = lastChanged
      } catch (error) {
        console.error('onUpdateTitle::', error.message)
      }
    },

    async onRemoveFunding (id) {
      try {
        await this.removeFunding(id)
        this.funding.splice(this.funding.findIndex((el) => el.id === id), 1)
      } catch (error) {
        console.error('onRemoveFunding::', error.message)
      }
    },

    async onUpdateFunding (id, awards) {
      try {
        const funding = await this.updateFunding(id, awards)
        const idx = this.funding.findIndex((el) => el.id === id)
        this.funding[idx] = funding
      } catch (error) {
        console.error('onUpdateFunding::', error.message)
      }
    },

    onAddFundingClick () {
      this.$q.dialog({
        component: AddFunding,
        parent: this,
        text: 'Add your funding source',
        title: 'Add Funding'
      }).onOk(async (fundings) => {
        try {
          const result = await this.insertFunding(fundings)
          this.funding.push(result)
        } catch (error) {
          console.error('Cannot add new Funding', error.message)
        }
      }).onCancel(() => {
      }).onDismiss(() => {})
    },

    // Qusar Dialog Plugin will sync props
    // A workarround to wait for users validation
    // is to deep copy your props
    // and wait for the ok event
    onShowCollaborators () {
      this.$q.dialog({
        component: Collaborators,
        parent: this,
        title: 'Collaborators',
        data: this.deepCopy(this.collaborators)
      }).onOk(async (collaborators) => {
        try {
          const result = await this.updateCollaborators(collaborators)
          this.collaborators = result
        } catch (error) {
          console.error('Cannot update collaborators', error.message)
        }
      }).onCancel(() => {
      }).onDismiss(() => {})
    },

    // Qusar Dialog Plugin will sync props
    // A workarround to wait for users validation
    // is to deep copy your props
    // and wait for the ok event
    onAddUrlClick () {
      this.$q.dialog({
        component: AddLinks,
        parent: this,
        title: 'Links',
        data: this.deepCopy(this.urls),
        okLabel: 'SAVE'
      }).onOk(async (links) => {
        try {
          const { urls } = await this.updateUrls(links)
          this.urls = urls
        } catch (error) {
          console.error('Cannot save urls::', error.message)
        }
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },

    deepCopy (data) {
      return JSON.parse(JSON.stringify(data))
    }

  }
}
</script>
