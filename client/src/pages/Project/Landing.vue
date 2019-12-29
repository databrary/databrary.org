<template>
  <div>
    <q-toolbar>
      <q-toolbar-title>

      </q-toolbar-title>
      <q-btn v-on:click="toggleEditmode()" flat :label="editmodeLabel" />
      <!-- Get route ID  -->
      <q-btn :to="asset.id + '/contributors'" flat icon="person" label="Contributors" />
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
          <div class="text-h5">
            Description
          </div>
          <p class="text-body1 q-pr-sm">
            Two pre-adolescent girls engaged in social and gross motor free play on a public
            playground. The girls were instructed to show the camera operators the various ways
            in which they play.They used monkey bars, fences, ledges, trees, swings, climbers,
            and other equipment in ways that were not the likely uses intended by the playground
            designers. The girls were filmed from two camera views. Other children and parents
            entered and left the scene.
          </p>
          <div class="text-h5">
            Citation
          </div>
          <citationBuilder doi="10.1037/0003-066X.59.1.29" :editMode="editMode"/>
          <div class="text-h5 q-mt-md">
            Contributors
          </div>
          <q-avatar class="q-ma-xs" size="40px" v-for="k in 6" :key="k">
            <img :src="'https://cdn.quasar.dev/img/avatar' + k + '.jpg'">
          </q-avatar>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-3">
          <q-card class="q-px-sm" flat bordered>
            <q-list>
              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="primary" name="create" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Created on</q-item-label>
                  <q-item-label caption>{{ datetimeCreated }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="primary" name="grain" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Sessions</q-item-label>
                  <q-item-label caption>1 (1 shared)</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="primary" name="access_time" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Ages</q-item-label>
                  <q-item-label caption>10.8 yrs–12.1 yrs (M = 11.5 yrs)</q-item-label>
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

              <q-item class="justify-content-center">
                <q-table
                  :data="filePermission"
                  :columns="columns"
                  row-key="name"
                  flat
                  bordered
                  :pagination.sync="pagination"
                  hide-bottom
                ></q-table>
              </q-item>
              <div class="justify-content-center q-px-md q-py-sm">
                <div class="text-h6">
                  Tags
                </div>
                <q-badge class="q-mx-xs" v-for="i in 4" :key="i" color="accent">
                  Tag {{i}}
                </q-badge>
              </div>
            </q-list>
          </q-card>
        </div>
      </div>
    </q-page>
  </div>
</template>
<script>
import { date } from 'quasar'
import citationBuilder from '../../components/CitationBuilder.vue'
import gql from 'graphql-tag'

export default {
  name: 'PageId',
  components: {
    citationBuilder
  },
  data: () => ({
    projectIdFromRoute: null,
    asset: null,
    projectName: null,
    datetimeCreated: null,
    editMode: false,
    editmodeLabel: 'Edit',
    columns: [
      {
        name: 'File Type',
        label: 'File Type',
        field: 'fileType',
        classes: 'bg-grey-2 ellipsis'
      },
      {
        name: 'Release Level',
        label: 'Release Level',
        field: 'releaseLevel',
        classes: 'bg-grey-2 ellipsis'
      },
      {
        name: '# of Files',
        label: '# of Files',
        field: 'fileCount'
      }
    ],
    filePermission: [
      {
        fileType: 'sessions',
        releaseLevel: 'authorized users',
        fileCount: 5
      }
    ],
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
              asset_type: {_eq: project}
            }) {
              id
              asset_type
              name
              datetime_created
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
<style>
.profile-border {
  border: 5px solid white!important;
}
.dataView {
  max-width: 700px;
  margin: auto;
}
</style>
