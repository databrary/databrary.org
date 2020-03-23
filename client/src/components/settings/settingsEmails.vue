<template>
  <div>
  <div class="text-h4 q-mb-md">Emails</div>
  <q-list bordered separator>
    <q-item v-for="(email, index) in emails" :key="email" dense>
      <q-item-section>
        <div class="q-my-md">
          {{ email }}
          <q-badge v-if="isPrimary(index)" color="blue" align="middle">Primary</q-badge>
        </div>
      </q-item-section>
      <q-item-section right >
        <div class="text-right">
          <q-avatar class="text-red-5" v-if="!isPrimary(index)" icon="delete" @click="removeEmail(index)"/>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
  <div class="q-pt-md">
    <b>Add new email:</b>
    <q-input
      v-model.trim="email"
      outlined
      dense
      label="Email"
      class="q-pb-md"
    >
    <template v-slot:after>
      <q-btn  color="primary" label="Add" @click="addEmail" />
    </template>
    </q-input>
  </div>
  <div class="q-pt-md">
    <b>Primary email address</b>
    <div class="text-caption">
      {{ primaryEmail }} will be used for account-related notifications,
      any web-based operations (e.g. edits), and can be used for password resets.
    </div>
    <q-select
      v-model="updatePrimaryEmail"
      :options="emails"
      label="Primary email"
    >
    <template v-slot:after>
      <q-btn color="primary" label="Update" @click="setPrimaryEmail" />
    </template>
    </q-select>
  </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
import { get } from 'vuex-pathify'
import { isEmail } from 'validator'

export default {
  data () {
    return {
      primaryEmail: '',
      updatePrimaryEmail: '',
      emails: [],
      email: ''
    }
  },
  computed: {
    userId: get('app/dbId')
  },
  async created () {
    this.getUserEmails()
  },
  methods: {
    isPrimary: function (index) {
      return this.emails[index] === this.primaryEmail
    },
    setPrimaryEmail: function () {
      if (this.updatePrimaryEmail !== this.primaryEmail) {
        this.primaryEmail = this.updatePrimaryEmail
      }
    },
    addEmail: function () {
      if (this.email.length > 0) {
        if (!this.emails.includes(this.email) && isEmail(this.email)) {
          this.emails.push(this.email)
          this.email = ''
        }
      }
    },
    removeEmail: function (index) {
      if (!this.isPrimary(index)) {
        this.emails.splice(index, 1)
      }
    },
    async getUserEmails () {
      const result = await this.$apollo.query({
        query: gql`
          query GetUserEmails ($userId: Int!) {
            users(where: {id: {_eq: $userId}}) {
              emails
              email_primary
            }
          }
        `,
        variables: {
          userId: this.userId
        }
      })
      this.primaryEmail = result.data.users[0].email_primary
      if (result.data.users[0].emails !== null &&
        result.data.users[0].emails.length > 0) {
        this.emails = result.data.users[0].emails
      }
    }
  }
}
</script>
