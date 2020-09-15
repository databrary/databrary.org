<template>
  <q-splitter v-model="splitterModel" style="height: 400px">
    <template v-slot:before>
      <div class="q-pa-md">
        <q-tree
          default-expand-all
          :nodes="data"
          node-key="label"
          selected-color="primary"
          :selected.sync="selected"
        />
      </div>
    </template>
    <template v-slot:after>
      <q-toolbar class="no-padding bg-white text-dark">
        <q-toolbar-title></q-toolbar-title>
        <q-btn
          flat
          dense
          icon="view_module"
          color="black"
          @click="gridView = true"
        >
          <q-tooltip>Grid View</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          icon="format_list_bulleted"
          color="black"
          @click="gridView = false"
        >
          <q-tooltip>List View</q-tooltip>
        </q-btn>
      </q-toolbar>
      <q-tab-panels
          v-model="selected"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
          class="full-height"
      >
        <q-tab-panel
            class="full-height"
            v-for="(ele) in data"
            :key="ele.id"
            :name="selected"
        >
          <div v-if="getElementObj(ele, selected).icon === 'folder'">
              <q-table
                class="max-height max-weigth"
                :grid="gridView"
                :title="getElementObj(ele, selected).label"
                :data="getElementObj(ele, selected).children"
                :columns="columns"
                row-key="Name"
                virtual-scroll
                :pagination.sync="pagination"
                :rows-per-page-options="rowsPerPageOptions"
                flat
              >
                <template v-if="gridView" v-slot:item="props">
                  <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
                    <q-card flat>
                      <q-card-section class="text-center" >
                        <q-icon size="xl" name="insert_drive_file"/>
                      </q-card-section>
                      <q-card-section  class="text-center">
                        <div>{{ props.row.label }}</div>
                      </q-card-section>
                    </q-card>
                  </div>
                </template>
              </q-table>
          </div>
          <div v-else>
              <div class="text-h4 q-mb-md">
                  {{ getElementObj(ele, selected).label }}
              </div>
              <q-skeleton  height="150px" square />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
</template>

<script>

export default {
  props: ['data'],
  data () {
    return {
      selected: 'Data',
      splitterModel: 30,
      gridView: true,
      pagination: {
        page: 1,
        rowsPerPage: this.getItemsPerPage()
      },
      columns: [
        {
          name: 'Name',
          label: 'Name',
          required: true,
          align: 'left',
          sortable: true,
          field: row => row.label,
          format: val => `${val}`
        },
        {
          name: 'Size',
          label: 'Size',
          required: true,
          align: 'left',
          sortable: true,
          field: row => row.size,
          format: val => `${val}`
        },
        {
          name: 'Uploaded on',
          label: 'Uploaded on',
          required: true,
          align: 'left',
          sortable: true,
          field: row => row.uploadedDatetime,
          format: val => `${val}`
        },
        {
          name: 'Format',
          label: 'Format',
          required: true,
          align: 'left',
          sortable: true,
          field: row => row.format,
          format: val => `${val}`
        }
      ]
    }
  },
  watch: {
    '$q.screen.name' () {
      this.pagination.rowsPerPage = this.getItemsPerPage()
    }
  },
  computed: {
    cardContainerClass () {
      if (this.$q.screen.gt.xs) {
        return 'grid-masonry grid-masonry--' + (this.$q.screen.gt.sm ? '3' : '2')
      }

      return void 0
    },

    rowsPerPageOptions () {
      if (this.gridView) return [ 0 ]

      if (this.$q.screen.gt.xs) {
        return this.$q.screen.gt.sm ? [ 3, 6, 9 ] : [ 3, 6 ]
      }

      return [ 3 ]
    }
  },
  methods: {
    getElementObj (data, selected) {
      try {
        if (data.label === selected) return data
        if (!data.children) return null

        return data.children.filter(el => el.label === selected)[0]
      } catch (e) {
        console.log(e.message)
      }
      return null
    },
    getItemsPerPage () {
      if (!this.gridView) return 0
      const { screen } = this.$q
      if (screen.lt.sm) {
        return 3
      }
      if (screen.lt.md) {
        return 6
      }
      return 9
    }
  }
}
</script>
