<template>
  <div>
    <q-toolbar>
      <q-toolbar-title>

      </q-toolbar-title>
      <q-btn
        v-on:click="toggleEditmode()"
        flat
        :label="editmodeLabel"
      />
      <!-- Get route ID  -->
      <q-btn
        :to="asset.id + '/contributors'"
        flat
        icon="person"
        label="Contributors"
      />
    </q-toolbar>
    <div class="row">
      <div class="col-12 bg-grey-10">
        <q-img
          src="https://nyu.databrary.org/volume/9/thumb?size"
          style="max-height: 400px;"
          contain
        >
          <div class="absolute-bottom text-h5 text-center q-pa-xs">
            {{ asset.name }}
          </div>
        </q-img>
      </div>
    </div>
    <q-page padding>
      <div class="max-page-width row">
        <div class="col-xs-12 col-sm-8 col-md-9">
          <div class="text-h5 q-mt-md">
            Description
          </div>
          <p class="text-body1 q-pa-sm">
            Two pre-adolescent girls engaged in social and gross motor free play on a public
            playground. The girls were instructed to show the camera operators the various ways
            in which they play.They used monkey bars, fences, ledges, trees, swings, climbers,
            and other equipment in ways that were not the likely uses intended by the playground
            designers. The girls were filmed from two camera views. Other children and parents
            entered and left the scene.
          </p>
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
                  <q-item-label caption>{{ datetimeCreated }}</q-item-label>
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
                  <q-item-label caption>1 (1 shared)</q-item-label>
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
        <div class="q-mt-md">
          <div class="text-h5 q-mt-md">
            File Release Levels
          </div>
          <!-- TODO(Reda): Improve css byt adding style -->
          <q-item class="justify-content-left">
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
        <FileExplorer></FileExplorer>
      </div>
    </q-page>
  </div>
</template>
<script>
// TODO(Reda): Fetch project id info here
import { date } from 'quasar'
import citationBuilder from '../../components/CitationBuilder.vue'
import FileExplorer from '../../components/FileExplorer.vue'
import gql from 'graphql-tag'

export default {
  name: 'PageId',
  components: {
    citationBuilder,
    FileExplorer
  },
  data: () => ({
    projectIdFromRoute: null,
    asset: null,
    projectName: null,
    datetimeCreated: null,
    editMode: false,
    editmodeLabel: 'Edit',
    session_private: 51,
    session_authorized: 43,
    session_audiences: 336,
    pagination: {
      page: 1,
      rowsPerPage: 0 // 0 means all rows
    },
    slide: 1,
    tab: 'data',
    ticked: [],
    filter: '',
    maximizedToggle: true,
    newVolumeName: 'New Volume'
  }),
  watch: {
    // whenever question changes, this function will run
    ticked () {
      this.newVolumeChildren = []
      this.ticked.forEach((checkedEle) => {
        this.newVolumeChildren.push({
          label: checkedEle,
          icon: 'insert_drive_file'
        })
      })
    },
    editMode () {
      if (!this.editMode) {
        this.editmodeLabel = 'Edit'
      } else {
        this.editmodeLabel = 'Save'
      }
    },
    '$route': 'fetchData'
  },
  // TODO(Reda): Fetch project summary
  async created () {
    // this.generateCitation('http://doi.org/10.17910/B77P4V')
    this.projectIdFromRoute = this.$route.params.projectId
    this.fetchData()
  },
  methods: {
    async fetchData () {
      const result = await this.$apollo.query({
        query: gql`
          query GetProject($projectId: Int!) {
            assets(where: {
              id: {_eq: $projectId},
              assetType: {_eq: project}
            }) {
              id
              assetType
              name
              datetimeCreated
            }
          }
        `,
        variables: {
          projectId: this.projectIdFromRoute
        }
      })
      this.asset = result.data.assets[0]
      this.datetimeCreated = date.formatDate(
        this.asset.datetime_created,
        'YYYY-MM-DD'
      )
    },
    toggleEditmode () {
      this.editMode = !this.editMode
    }
  }
}
</script>
