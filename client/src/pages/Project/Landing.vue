<template>
  <div>
    <q-toolbar>
      <q-toolbar-title>

      </q-toolbar-title>
      <q-btn v-on:click="toggleEditmode()" flat :label="editmodeLabel" />
      <!-- Get route ID  -->
      <q-btn to="1/contributors" flat icon="person" label="Contributors" />
    </q-toolbar>
    <div class="row">
      <div class="col-12 bg-grey-10">
        <q-img
          src="https://nyu.databrary.org/volume/9/thumb?size"
          style="max-height: 400px;"
          contain
        >
          <div class="absolute-bottom text-h5 text-center q-pa-xs">
            Children's social and motor play on a playground
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
                  <q-item-label>Added on</q-item-label>
                  <q-item-label caption>March 2014</q-item-label>
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
        <div class="col-12">
          <section class="row q-py-lg">
            <q-toolbar class="no-padding bg-white text-dark q-mt-sm">
              <q-toolbar-title>Data</q-toolbar-title>
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
              <q-linear-progress :value="0.6" color="pink" />
              <q-uploader
                url="http://localhost:4444/upload"
                label="Upload Files"
                multiple
                batch
                style="max-width: 1000px"
              />
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
                      <iframe
                        class="dataView"
                        width="100%"
                        height="300px"
                        src="https://www.youtube.com/embed/owsfdh4gxyc"
                        frameborder="0"
                        allowfullscreen
                      />
                    </q-tab-panel>
                  </q-tab-panels>
                </template>
              </q-splitter>
            </div>
          </section>
        </div>
      </div>
    </q-page>
  </div>
</template>
<script>
import citationBuilder from '../../components/CitationBuilder.vue'

export default {
  name: 'PageId',
  components: {
    citationBuilder
  },
  data: () => ({
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
    editMode () {
      if (!this.editMode) {
        this.editmodeLabel = 'Edit'
      } else {
        this.editmodeLabel = 'Save'
      }
    }
  },
  mounted () {
    console.log(this.$route)
    this.generateCitation('http://doi.org/10.17910/B77P4V')
  },
  methods: {
    toggleEditmode () {
      this.editMode = !this.editMode
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
