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
          doi="10.1037/0003-066X.59.1.29"
          :editMode="editMode"
        />
        <div class="q-mt-md">
          <div class="text-h5 float-left">
            Investigators
            <div>
              <q-avatar
                class="q-ma-xs q-pa-sm"
                size="40px"
                v-for="k in 6"
                :key="k"
              >
                <img :src="'https://cdn.quasar.dev/img/avatar' + k + '.jpg'">
              </q-avatar>
            </div>
          </div>
          <div class="text-h5 float-right">
            Collaborators
            <div>
              <q-avatar
                class="q-ma-xs q-pa-sm"
                size="40px"
                v-for="k in 2"
                :key="k"
              >
                <img :src="'https://cdn.quasar.dev/img/avatar' + k + '.jpg'">
              </q-avatar>
            </div>
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
        <ProjectLinks
          class="col-12 q-pa-sm"
          ref="links"
          :data="urls"
          :show="3"
          @add-url="onAddUrl"
          @update-url="onUpdateUrl"
          @remove-url="onRemoveUrl"
        />
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
                  <th
                    class="bg-grey-4"
                    rowspan="3"
                  >sessions</th>
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
import { date, uid } from 'quasar'
import { gql } from '@apollo/client'
import { call } from 'vuex-pathify'

import CitationBuilder from '@/components/shared/CitationBuilder'
import FileManager from '@/components/fileManager/FileManager'
import ProjectTextArea from '@/components/project/ProjectTextArea'
import ProjectHeader from '@/components/project/ProjectHeader'
import ProjectLinks from '@/components/project/ProjectLinks'

const defaullDescription = 'View Description'

export default {
  name: 'ProjectViewer',
  components: {
    CitationBuilder,
    FileManager,
    ProjectTextArea,
    ProjectHeader,
    ProjectLinks
  },
  props: ['assetId'],
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
    this.fetchData()
  },
  computed: {
    createdOn () {
      return date.formatDate(this.datetimeCreated, 'MM-DD-YYYY')
    },
    lastChangedOn () {
      return date.formatDate(this.lastChanged, 'MM-DD-YYYY - hh:mm A')
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
              }
            }
          }
        `,
        variables: {
          assetId: this.assetId || this.$route.params.projectId
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
          assetId: this.assetId || this.$route.params.projectId,
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
          assetId: this.assetId || this.$route.params.projectId,
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

    async updateUrls () {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation UpdateProjectColor($id: Int!, $urls: jsonb!) {
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
          urls: this.urls
        }
      })

      return data.update_projects.returning[0]
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

    toggleEditmode () {
      this.editMode = !this.editMode
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

    async onAddUrlClick () {
      try {
        this.$refs.links.addUrl()
      } catch (error) {
        console.error('onAddUrlClick::', error.message)
      }
    },

    async onAddUrl (url) {
      try {
        if (url.url.length < 1) {
          throw new Error('URL is mendatory')
        }

        url.id = uid()
        this.urls.unshift(url)
        const { urls } = await this.updateUrls()
        this.$refs.links.clearNewUrl()
        this.urls = urls
      } catch (error) {
        console.error('onAddUrl::', error.message)
      }
    },

    async onRemoveUrl (urlId) {
      try {
        const index = this.urls.map((url) => url.id).indexOf(urlId)
        this.urls.splice(index, 1)
        const { urls } = await this.updateUrls()
        this.urls = urls
      } catch (error) {
        console.error('onRemoveUrl::', error.message)
      }
    },

    async onUpdateUrl () {
      try {
        const { urls } = await this.updateUrls()
        this.urls = urls
      } catch (error) {
        console.error('onUpdateUrl::', error.message)
      }
    }
  }
}
</script>
