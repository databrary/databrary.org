<template>
  <section class="row q-py-lg">
    <q-toolbar class="no-padding bg-white text-dark q-mt-sm">
      <q-toolbar-title>Files</q-toolbar-title>
      <q-btn
        flat
        icon="cloud_upload"
        color="primary"
        label="Upload"
        @click="fileUploadDialog = true"
      >
        <q-tooltip>
          Upload files or folders to your project
        </q-tooltip>
      </q-btn>
      <q-btn
        flat
        icon="folder"
        color="primary"
        label="Create Virtual Volume"
        @click="volumesDialog = true"
      >
        <q-tooltip>Create a new volume from selected data</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-dialog
      v-model="volumesDialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white text-dark">
        <q-bar>
          <div class="text-h5">Create New Volume</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="row">
            <div class="col-sm-5 col-md-5 col-lg-5 col-xl-5">
              <h6 class="no-margin">Shared Data</h6>
              <q-input
                ref="filter"
                dense
                v-model="filter"
                label="Filter"
                class="q-px-md"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="filter !== ''"
                    name="clear"
                    class="cursor-pointer"
                    @click="resetFilter"
                  />
                </template>
              </q-input>
              <q-tree
                :nodes="sharedData"
                node-key="label"
                tick-strategy="leaf"
                :ticked.sync="ticked"
                :filter="filter"
              />
            </div>
            <div
              class="col-sm-2 col-md-2 col-lg-2 col-xl-2 self-center text-center q-px-sm"
            >
              <q-icon size="24px" name="arrow_forward" />
              <div>Select files on the left to create a new volume</div>
              <q-icon size="24px" name="arrow_forward" />
            </div>
            <div class="col-sm-5 col-md-5 col-lg-5 col-xl-5">
              <h6 class="no-margin">New Volume</h6>
              <q-input v-model="newVolumeName" dense />
              <q-tree
                :nodes="newVolumeChildren"
                node-key="label"
                default-expand-all
              />
            </div>
          </div>
          <div class="row justify-end">
            <q-btn
              type="submit"
              @click="createVolume"
              label="Create Volume"
              class="q-mt-md"
              color="teal"
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="fileUploadDialog" position="bottom">
      <FileUploader />
    </q-dialog>
    <div class="col-xs-12 col-sm-12 col-md-12">
      <q-splitter v-model="splitterModel" style="height: 400px">
        <template v-slot:before>
          <div class="q-pa-md">
            <q-tree
              :nodes="data"
              node-key="label"
              selected-color="primary"
              :selected.sync="selected"
              default-expand-all
            />
          </div>
        </template>
        <template v-slot:after>
          <q-tab-panels
            v-model="selected"
            animated
            transition-prev="jump-up"
            transition-next="jump-up"
            class="full-height"
          >
            <q-tab-panel
              class="full-height"
              v-for="(ele, index) in data"
              :key="index + 'data'"
              :name="getKey(data[index], selected)"
            >
              <div class="text-h4 q-mb-md">
                {{ getKey(data[index], selected) }}
              </div>
              <q-skeleton height="150px" square />
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </div>
  </section>
</template>

<script>
import { date } from 'quasar'
import gql from 'graphql-tag'
import FileUploader from './FileUploader'

export default {
  name: 'FileExplorer',
  components: {
    FileUploader
  },
  data: () => ({
    datetimeCreated: null,
    pagination: {
      page: 1,
      rowsPerPage: 0 // 0 means all rows
    },
    slide: 1,
    tab: 'data',
    ticked: [],
    filter: '',
    sharedData: [
      {
        label: 'RyanMason',
        icon: 'folder',
        children: [
          {
            label: 'data3.txt',
            icon: 'insert_drive_file'
          },
          {
            label: 'schema4.json',
            icon: 'insert_drive_file'
          },
          {
            label: 'videoTime5.mp4',
            icon: 'insert_drive_file'
          }
        ]
      },
      {
        label: 'JaneDoe',
        icon: 'folder',
        children: [
          {
            label: 'data2.txt',
            icon: 'insert_drive_file'
          },
          {
            label: 'schema2.json',
            icon: 'insert_drive_file'
          },
          {
            label: 'videoRun.mp4',
            icon: 'insert_drive_file'
          }
        ]
      },
      {
        label: 'QunHue',
        icon: 'folder',
        children: [
          {
            label: 'data.txt',
            icon: 'insert_drive_file'
          },
          {
            label: 'schema.json',
            icon: 'insert_drive_file'
          },
          {
            label: 'videoTime.mp4',
            icon: 'insert_drive_file'
          }
        ]
      }
    ],
    data: [
      {
        label: 'data',
        icon: 'folder',
        children: [
          {
            label: 'Good food',
            icon: 'insert_drive_file'
          },
          {
            label: 'Quality ingredients',
            icon: 'insert_drive_file'
          },
          {
            label: 'Good recipe',
            icon: 'insert_drive_file'
          }
        ]
      },
      {
        label: 'A Volume',
        icon: 'folder',
        children: [
          {
            label: 'some data.csv',
            icon: 'insert_drive_file'
          },
          {
            label: 'video.mp4',
            icon: 'insert_drive_file'
          }
        ]
      }
    ],
    newVolumeChildren: [],
    volumesDialog: false,
    fileUploadDialog: false,
    maximizedToggle: true,
    newVolumeName: 'New Volume',
    splitterModel: 30,
    selected: 'Good food'
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
    '$route': 'fetchData'
  },
  async created () {
    this.projectId = this.$route.params.projectId
    this.fetchData()
  },
  methods: {
    async fetchData () {
      const result = await this.$apollo.query({
        query: gql`
          query GetProject($projectId: Int!) {
            assets(where: {
              id: {_eq: $projectId},
              type_id: {_eq: 1}
            }) {
              name
              datetime_created
            }
          }
        `,
        variables: {
          projectId: this.projectId
        }
      })
      const project = result.data.assets[0]
      this.projectName = project.name
      this.datetimeCreated = date.formatDate(
        project.datetime_created,
        'YYYY-MM-DD'
      )
    },
    resetFilter () {
      this.filter = ''
      this.$refs.filter.focus()
    },
    createVolume () {
      const newVolume = {
        label: this.newVolumeName,
        icon: 'folder',
        children: this.newVolumeChildren
      }
      this.data.push(newVolume)
      this.ticked = []
      this.volumesDialog = false
    },
    getKey (data, selected) {
      try {
        return data.children.filter(e => e.label === selected)[0].label
      } catch (e) {
        console.log(e)
      }
      return null
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
