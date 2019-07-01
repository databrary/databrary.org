<template>
<q-page padding class="row max-page-width">
  <div class="col-xs-12 col-sm-12 col-md-9">
    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      flat
    >
     <template v-slot:top="props">
        <div class="col-2 q-table__title">
          <h5 class="q-ma-none">Contrubutors</h5>
        </div>
        <q-space />
        <div v-if="selected.length <= 5">
          <q-avatar
            class="q-ma-xs"
            size="32px"
            v-for="(contrib, index) in selected"
            :key="index"
          >
            <img :src="contrib.icon">
          </q-avatar>
        </div>
        <div v-else class="q-pa-sm">
          {{selected.length}} users selected
        </div>
        <q-select
          v-if="selected.length >= 1"
          filled
          dense
          v-model="actionOpt"
          :options="actionOptions"
          label="Action"
        />
        <q-select
          dense
          class="q-ml-sm"
          v-if="actionOpt === 'Permissions' && selected.length >= 1"
          filled
          plaecholder="test"
          v-model="childActionOpt"
          :options="childActionOptions"
          label="Action"
        />
        <q-btn
          v-if="selected.length >= 1"
          label="Run"
          class="q-ml-sm"
          color="warning"
        >
        </q-btn>
      </template>

    </q-table>
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 q-pa-sm">
    <q-card flat bordered class="">
      <q-card-section>
        <q-select
          filled
          v-model="model"
          use-input
          input-debounce="0"
          use-chips
          label="Add Contributors"
          :options="options"
          @filter="filterFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div class="row justify-end">
          <q-btn
            label="Add Contributor"
            class="q-mt-sm"
            color="green"
            @click="addContributor()"
          >
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>
</q-page>
</template>
<script>
const stringOptions = [
  'Ryan Mason | ryan@221b.io', 'Jeff Spies | jeff@221b.io', 'Jenny Robertson | jenny@email.com',
];
export default {
  data() {
    return {
      selected: [],
      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Name',
          align: 'left',
          field: 'name',
          sortable: true,
        },
        {
          name: 'permission',
          align: 'center',
          label: 'Permission',
          field: 'permission',
          sortable: true,
        },
      ],
      data: [
        {
          name: 'Fred Alex',
          permission: 'Read & Write',
          icon: 'https://cdn.quasar.dev/img/avatar1.jpg',
        },
        {
          name: 'Sarah Perter',
          permission: 'Read',
          icon: 'https://cdn.quasar.dev/img/avatar2.jpg',
        },
        {
          name: 'Jackie Blob',
          permission: 'Read & Write',
          icon: 'https://cdn.quasar.dev/img/avatar3.jpg',
        },
      ],
      model: null,
      options: stringOptions,
      actionOptions: ['Delete', 'Permissions'],
      actionOpt: 'Delete',
      childActionOptions: ['Read', 'Read & Write'],
      childActionOpt: 'Read',
    };
  },
  methods: {
    getSelectedString() {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.data.length}`;
    },
    filterFn(val, update) {
      if (val === '') {
        update(() => {
          this.options = stringOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1);
      });
    },
    addContributor() {
      this.$q.notify({
        message: 'User Added',
        color: 'green',
      });
    },
  },
};
</script>

<style scoped>
</style>
