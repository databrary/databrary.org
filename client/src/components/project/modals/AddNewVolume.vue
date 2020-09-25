<template>
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
                :nodes="data"
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
</template>

<script>
export default {
  props: ['data', 'volumesDialog'],
  data () {
    return {
      ticked: [],
      newVolumeName: 'New Volume',
      filter: '',
      newVolumeChildren: []
    }
  },
  watch: {
    ticked () {
      this.newVolumeChildren = []
      this.ticked.forEach((checkedEle) => {
        this.newVolumeChildren.push({
          label: checkedEle,
          icon: 'insert_drive_file'
        })
      })
    }
  },
  methods: {
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
      // this.data.push(newVolume)
      this.$emit('input', this.data.push(newVolume))
      this.ticked = []
      this.$emit('update:volumesDialog', false)
    }
  }
}
</script>
