<template>
  <div>
  <div class="text-h4 q-mb-md">Emails</div>
  <q-list bordered separator>
    <q-item dense>
      <q-item-section>
        <div>
          Ryanmasonjar@gmail.com
          <q-badge color="blue" align="middle">Primary</q-badge>
        </div>
      </q-item-section>
      <q-item-section right >
        <div class="text-right">
          <q-avatar class="text-red-5" icon="delete"/>
        </div>
      </q-item-section>
    </q-item>
    <q-item dense>
      <q-item-section>
        <div>
          rytiggy@gmail.com
        </div>
      </q-item-section>
      <q-item-section right >
        <div class="text-right">
          <q-avatar class="text-red-5" icon="delete"/>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
  <div class="q-pt-md">
    <b>Add new email:</b>
    <q-input
      outlined
      dense
      label="Email"
      class="q-pb-md"
    >
    <template v-slot:after>
        <q-btn color="primary" label="Add" />
    </template>
    </q-input>
  </div>
  <div class="q-pt-md">
    <b>Primary email address</b>
    <div class="text-caption">
      ryanmasonjar@gmail.com will be used for account-related notifications,
      any web-based operations (e.g. edits), and can be used for password resets.
    </div>
    <q-select
      v-model="primaryEmail"
      :options="emails"
      label="Primary email"
    >
    <template v-slot:after>
        <q-btn color="primary" label="Update" />
    </template>
    </q-select>
  </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      primaryEmail: 'ryanmasonjar@gmail.com',
      emails: [
        'ryanmasonjar@gmail.com', 'rytiggy@gmail.com',
      ],
    };
  },
};
</script>
