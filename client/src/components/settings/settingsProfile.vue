<template>
  <div class="row">
    <form @submit.prevent="saveProfile" class="col-xs-12 col-sm-12 col-md-8">
      <div class="text-h4 q-mb-md">Profile</div>
      <div class="row">
        <q-input
          v-model.trim="firstName"
          class="col-md-7 q-pr-sm"
          label="First Name:"
          dense
          outlined
          :rules="[val => !!val || 'Field is required']"
        />

        <q-input
          v-model="middleName"
          class="col-md-5 q-pl-sm"
          label="Middle Name:"
          dense
          outlined
          :rules="[]"
        />
      </div>

      <q-input
        v-model.trim="lastName"
        label="Last Name:"
        dense
        outlined
        :rules="[val => !!val || 'Field is required']"
      />

      <q-input
        v-model="citationName"
        class="q-my-sm"
        label="Citation Name:"
        dense
        outlined
        readonly
      />

      <q-input
        v-model.trim="displayFullName"
        class="q-my-sm"
        label="Display Name:"
        dense
        outlined
        clear-icon="close"
        @clear="buildDefaultDisplayName"
        clearable
        :rules="[val => !!val || 'Field is required']"
      />

      <q-input
        v-model="bio"
        outlined
        dense
        label="Bio:"
        class="q-my-sm"
        type="textarea"
      />

      <div class="text-h6 q-mb-md">URLs</div>
      <q-list class="q-mb-md" bordered separator>
        <q-item v-for="(url, index) in urls" :key="url" dense>
          <q-item-section>
            <div>
              {{ url }}
            </div>
          </q-item-section>
          <q-item-section right >
            <div class="text-right">
              <q-btn flat>
                <q-avatar size="28px" class="text-red-5" icon="delete" @click="deleteUrl(index)"/>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="q-pt-md">
        <b>Add new url:</b>
        <q-input
          v-model.trim="url"
          outlined
          dense
          label="url"
          class="q-pb-md"
        >
        <template v-slot:after>
          <q-btn color="primary" label="Add" @click="addUrl"/>
        </template>
        </q-input>
      </div>
      <div class="text-right">
        <q-btn type="submit" color="primary" :loading="saving" label="save" >
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </div>
    </form>
    <div class="order-sm-first order-md-last col-xs-12 col-sm-12 col-md-4 q-pa-sm text-center">
      <div class="text-h5 q-my-sm">Profile picture</div>
      <q-avatar  size="100px">
        <img :src="gravatar">
      </q-avatar>
      <br>
      <div class="q-my-sm">
        <AvatarUploader/>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import gql from 'graphql-tag'
import AvatarUploader from '../Upload/UploadAvatar.vue'
export default {
  name: 'SettingsProfile',
  data () {
    return {
      urls: [],
      bio: '',
      firstName: '',
      lastName: '',
      middleName: '',
      displayFullName: '',
      url: '',
      saving: false
    }
  },
  components: {
    AvatarUploader
  },
  computed: {
    gravatar: get('app/gravatar'),
    userId: get('app/dbId'),
    citationName: function () {
      return this.buildCitationName()
    }
  },
  async created () {
    this.getProfile()
  },
  methods: {
    buildCitationName: function () {
      if (this.lastName.length === 0 || this.firstName.length === 0) {
        return ''
      }
      return `${this.lastName}, ${this.firstName}${this.middleName ? `. ${this.middleName}` : ''}`
    },
    buildDefaultDisplayName: function () {
      this.displayFullName = `${this.firstName} ${this.lastName}`
    },
    addUrl: function () {
      console.log(`Url table ${typeof this.urls}`)
      if (this.url.length > 0) {
        this.urls.push(this.url)
        this.url = ''
      }
    },
    deleteUrl: function (index) {
      this.urls.splice(index, 1)
    },
    async getProfile () {
      console.log(`profile dbId ${this.userId}`)
      const result = await this.$apollo.query({
        query: gql`
          query GetUserProfile($userId: Int!) {
            users(where: {id: {_eq: $userId}}) {
              bio
              citation_name
              display_full_name
              first_name
              last_name
              middle_name
              urls
            }
          }
        `,
        variables: {
          userId: this.userId
        }
      })
      this.bio = result.data.users[0].bio
      this.firstName = result.data.users[0].first_name
      this.lastName = result.data.users[0].last_name
      this.middleName = result.data.users[0].middle_name
      this.displayFullName = result.data.users[0].display_full_name
      if (result.data.users[0].urls !== null &&
        result.data.users[0].urls.length > 0) {
        console.log(`saving hasura urls ${typeof result.data.users[0].urls}`)
        this.urls = result.data.users[0].urls
      }
      console.log(`profile ${JSON.stringify(result.data)}`)
    },
    async saveProfile () {
      this.saving = true
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation SaveUserProfile($userId: Int!, 
              $lastName: String!, 
              $firstName: String!, 
              $middleName: String!, 
              $bio: String, 
              $citationName: String!, 
              $displayFullName: String!, 
              $urls: jsonb!) 
            {
              update_users(
                where: {id: {_eq: $userId}}, 
                _set: {
                  last_name: $lastName, 
                  first_name: $firstName,
                  middle_name: $middleName, 
                  bio: $bio, 
                  citation_name: $citationName, 
                  display_full_name: $displayFullName,  
                  urls: $urls
                }
              ) 
                {
                returning {
                  id
                }
              }
            }
          `,
          variables: {
            userId: this.userId,
            lastName: this.lastName,
            firstName: this.firstName,
            middleName: this.middleName,
            citationName: this.citationName,
            displayFullName: this.displayFullName,
            bio: this.bio,
            urls: this.urls
          }
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
