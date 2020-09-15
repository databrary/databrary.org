<template>
  <section class="row q-pa-xs">
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
    <div class="col-xs-12 col-sm-12 col-md-12">
      <FileViewer :data="data"/>

      <!-- Create a new Volume Dialog  -->
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
      <!-- File Uploaded Dialog  -->
      <q-dialog v-model="fileUploadDialog" position="standard">
        <FileUploader />
      </q-dialog>
    </div>
  </section>
</template>

<script>
import { uid } from 'quasar'
import { gql } from '@apollo/client'

import FileUploader from '../Upload/FileUploader'
import FileViewer from './FileViewer'

export default {
  name: 'FileManager',
  components: {
    FileUploader,
    FileViewer
  },
  data: () => ({
    ticked: [],
    filter: '',
    sharedData: [],
    data: [], // Tree
    newVolumeChildren: [],
    volumesDialog: false,
    fileUploadDialog: false,
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
          query getProjectFiles($projectId: Int!) {
            assets(where: {assetType: {_eq: project}, id: {_eq: $projectId}}) {
              files {
                name
                fileFormatId
                fileobject {
                  size
                }
                uploadedDatetime
              }
            }
          }
        `,
        variables: {
          projectId: this.projectId
        }
      })
      const projectFiles = result.data.assets[0].files
      const files = projectFiles.map(
        ({ name: label, fileFormatId: format, fileobject: { size }, uploadedDatetime }) =>
          ({ id: uid(), label, size, format, uploadedDatetime, icon: 'insert_drive_file' })
      )
      this.data.push(
        {
          id: uid(),
          label: 'Data',
          icon: 'folder',
          children: [...files]
        }
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
