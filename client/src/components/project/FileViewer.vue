<template>
  <q-splitter v-model="splitterModel" style="height: 400px" after-class="no-scroll">
    <template v-slot:before>
      <div class="q-pa-md">
        <q-tree
          default-expand-all
          :nodes="data"
          node-key="label"
          selected-color="primary"
          :selected.sync="treeSelected"
        />
      </div>
    </template>
    <template v-slot:after>
      <q-toolbar class="bg-white text-dark q-px-sm">
        <!-- The title tag is needed to align the btn to the right -->
        <q-toolbar-title class="text-bold">{{treeSelected}}</q-toolbar-title>

        <q-btn
          class="q-mx-lg"
          color="primary"
          icon-right="cloud_download"
          label="Download"
          :disable="tableSelected.length === 0"
          no-caps
        >
          <q-tooltip>
            Download selected files
          </q-tooltip>
        </q-btn>

        <q-btn-toggle
          v-model="viewSelected"
          push
          dense
          toggle-color="primary"
          :options="viewOptions"
        >
          <template v-slot:grid>
            <div class="row items-center no-wrap">
              <q-icon name="view_module" />
            </div>
          </template>

          <template v-slot:list>
            <div class="row items-center no-wrap">
              <q-icon name="format_list_bulleted" />
            </div>
          </template>
        </q-btn-toggle>
      </q-toolbar>
      <q-tab-panels
        v-model="treeSelected"
        animated
        transition-prev="jump-up"
        transition-next="jump-up"
        v-for="ele in data"
        :key="ele.id"
      >
        <q-tab-panel
          :name="ele.label"
        >
          <div v-if="ele.icon === 'folder'">
            <q-table
              :grid="viewSelected == 'grid'"
              :data="ele.children ? ele.children : []"
              :columns="columns"
              row-key="label"
              selection="multiple"
              style="height: 350px"
              virtual-scroll
              :pagination.sync="pagination"
              :rows-per-page-options="[0]"
              flat
              :selected.sync="tableSelected"
            >
              <template v-if="gridView" v-slot:item="props">
                <div class="col-xs-12 col-sm-6 col-md-4">
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
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
</template>

<script>
import { date, format } from 'quasar'

export default {
  props: ['data'],
  data () {
    return {
      treeSelected: 'Data',
      tableSelected: [],
      splitterModel: 30,
      gridView: true,
      pagination: {
        rowsPerPage: 0
      },
      viewSelected: 'grid',
      viewOptions: [
        { value: 'grid', slot: 'grid' },
        { value: 'list', slot: 'list' }
      ],
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
          format: val => `${format.humanStorageSize(val)}`
        },
        {
          name: 'Uploaded on',
          label: 'Uploaded on',
          required: true,
          align: 'left',
          sortable: true,
          field: row => row.uploadedDatetime,
          format: val => `${date.formatDate(val, 'MM-DD-YYYY')}`
        }
        // {
        //   name: 'Format',
        //   label: 'Format',
        //   required: true,
        //   align: 'left',
        //   sortable: true,
        //   field: row => row.format,
        //   format: val => `${val}`
        // }
      ]
    }
  },
  methods: {
    getElementObj (element, selected) {
      try {
        if (element.label === selected) return element
        if (!element.children) return null

        return element.children.filter(el => el.label === selected)[0]
      } catch (e) {
        console.log(e.message)
      }
      return null
    }
  }
}
</script>
