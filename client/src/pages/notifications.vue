<template>
  <q-page padding class="max-page-width">
    <h4 class="text-weight-light no-margin q-py-md text-center">Your Notifications</h4>
   <q-table
      class="remove-table-shadow notification-table"
      :data="data"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:top-right>
        <q-input  dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            <q-btn
              class="text-weight-normal"
              flat
              @click="goToNotifcation()"
            >
            {{ props.row.name }}
          </q-btn>
          </q-td>
          <q-td key="type" :props="props">{{ props.row.type }}</q-td>
          <q-td key="status" :props="props">{{ props.row.status }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>
<script>
export default {
  data() {
    return {
      filter: '',
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
        },
        {
          name: 'status',
          required: true,
          label: 'Status',
          align: 'left',
          sortable: true,
          field: row => row.status,
          format: val => `${val}`,
        },
        {
          name: 'type',
          required: true,
          label: 'Type',
          align: 'left',
          sortable: true,
          field: row => row.type,
          // format: val => `<q-badge color="blue">${val}</q-badge>`,
        },
      ],
      data: [
        {
          name: 'Clair edited landing page',
          type: 'Project update',
          status: 'Unread',
        },
        {
          name: 'Clair was added to PROJECT',
          type: 'Project update',
          status: 'Unread',
        },
        {
          name: 'Rick messaged you',
          type: 'Message',
          status: 'Read',

        },
      ],
    };
  },
  methods: {
    goToNotifcation() {
      console.log('hete', this.$router);
      // this.$router.push({ path: 'messenger' });
    },
  },
};
</script>
<style>
.remove-table-shadow {
  box-shadow: none!important;
}
</style>
