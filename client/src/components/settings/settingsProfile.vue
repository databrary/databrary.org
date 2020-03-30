<template>
  <div class="row">
    <form @submit.prevent="saveProfile" class="col-xs-12 col-sm-12 col-md-8">
      <div class="q-mb-md">
        <div class="row">
          <div class="col-10 text-h4">Profile</div>
          <div class="col-2 text-right">
            <q-btn type="submit" color="primary" :loading="saving" label="save" >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="row">
        <q-input
          v-model.trim="profile.givenName"
          class="col-4 q-pr-sm"
          label="First/Given Name:"
          dense
          outlined
          :rules="[val => !!val || 'Field is required']"
        />

        <q-input
          v-model="profile.additionalName"
          class="col-4 q-pl-sm"
          label="Middle/Additional Name:"
          dense
          outlined
          :rules="[]"
        />

        <q-input
          v-model.trim="profile.familyName"
          class="col-4 q-pl-sm"
          label="Last/Family Name:"
          dense
          outlined
          :rules="[val => !!val || 'Field is required']"
        />
      </div>

      <div class="row">
        <q-input
          v-model.trim="profile.displayFullName"
          class="col-5 q-my-sm"
          label="Display Name:"
          dense
          outlined
          clear-icon="close"
          @clear="buildDefaultDisplayName"
          clearable
          :rules="[val => !!val || 'Field is required']"
        />
        <p class="text-italic text-justify col-7 q-px-md q-my-sm">
          This is how others on Databrary will see your name, you can edit this to your liking.
        </p>
      </div>

      <div class="row">
        <q-input
          v-model="citationName"
          class="col-5 q-my-sm"
          label="Citation Name:"
          dense
          outlined
          readonly
          :rules="[]"
        />

        <p class="text-italic text-justify col-7 q-px-md q-my-sm">
          Citations are built automatically across Databrary using first, middle and last names.
        </p>
      </div>

      <div class="row">
        <q-input
          v-model="profile.orcid"
          class="col-5 q-my-sm"
          label="ORCID:"
          dense
          outlined
          mask="####-####-####-####"
          fill-mask="#"
          :rules="[]"
        />

        <p class="text-italic text-justify col-7 q-px-md q-my-sm">
          Your unique 16-digit alphanumeric code that identifies scientific/academic constributors.
        </p>
      </div>

      <div class="row">
        <q-field
          stack-label
          label="Authorized affiliation:"
          class="col-5"
          dense
          readonly
          outlined
          :rules="[]"
        >
          <template v-slot:control>
            <div style="font-style: italic;font-size: small" tabindex="0">
              No affiliation yet. Click <a href='/'>here</a> to apply.
            </div>
          </template>
        </q-field>

        <p class="text-italic text-justify col-7 q-px-md q-my-sm">
          For access to restricted data, you must be authorized by an institution.
        </p>
      </div>

      <q-input
        v-model="profile.bio"
        outlined
        dense
        label="About me:"
        class="q-my-sm"
        type="textarea"
      />

      <div class="text-h6 q-mb-md">URLs</div>
      <q-list class="q-mb-md" bordered separator>
        <q-item class="row" v-for="(url, index) in profile.urls" :key="url.url" dense>
          <q-item-section class="col-2">
            <q-item-label>
              {{ url.label }}
            </q-item-label>
          </q-item-section>
          <q-item-section class="col-8">
            <div>
              {{ url.url }}
            </div>
          </q-item-section>
          <q-item-section right >
            <div class="text-right">
              <q-btn flat>
                <q-avatar size="28px" class="text-right text-red-5" icon="delete" @click="deleteUrl(index)"/>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="q-pt-md">
        <b>Add new url:</b>
      </div>
      <div class="q-pt-md">
        <div class="row">
          <q-input
            v-model.trim="urlLabel"
            outlined
            dense
            label="label"
            class="col-2 q-pb-md"
          />
          <q-input
            v-model.trim="url"
            outlined
            dense
            label="url"
            class="col-10 q-pb-md"
          >
          <template v-slot:after>
            <q-btn color="primary" label="Add" @click="addUrl"/>
          </template>
          </q-input>
        </div>
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

// TODO(Reda): Enable profile saving only when fields changed
// TODO(Reda): Add "Use Gravatar" button bellow Change Profile Picture
// TODO(Reda): Change display name input's icon to reset
// TODO(Reda): Fix vuex state persist between pages refresh
// https://forum.vuejs.org/t/vuex-state-is-undefined-when-refresh-page/42702
// https://stackoverflow.com/questions/43027499/vuex-state-on-page-refresh

export default {
  name: 'SettingsProfile',
  data () {
    return {
      profile: {
        urls: [],
        bio: '',
        familyName: '',
        givenName: '',
        additionalName: '',
        displayFullName: ''
      },
      url: '',
      urlLabel: '',
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
      if (this.profile.familyName.length === 0 || this.profile.givenName.length === 0) {
        return ''
      }
      const citationFirstName = this.profile.givenName.charAt(0).toUpperCase()
      const citationMiddleName = this.profile.additionalName.charAt(0).toUpperCase()
      return `${this.profile.familyName}, ${citationFirstName}. ${this.profile.additionalName ? `${citationMiddleName}.` : ''}`
    },
    buildDefaultDisplayName: function () {
      this.displayFullName = `${this.profile.givenName} ${this.profile.familyName}`
    },
    addUrl: function () {
      if (this.url.length > 0) {
        this.profile.urls.push({
          'label': this.urlLabel,
          'url': this.url
        })
        this.url = ''
        this.urlLabel = ''
      }
    },
    deleteUrl: function (index) {
      this.profile.urls.splice(index, 1)
    },
    async getProfile () {
      const result = await this.$apollo.query({
        query: gql`
          query GetUserProfile($userId: Int!) {
            users(where: {id: {_eq: $userId}}) {
              bio
              displayFullName
              givenName
              familyName
              additionalName
              urls
              orcid
            }
          }
        `,
        fetchPolicy: 'no-cache', // Important to not cache this query
        variables: {
          userId: this.userId
        }
      })
      this.setProfile(JSON.parse(JSON.stringify(result.data.users[0])))
    },
    async saveProfile () {
      try {
        this.saving = true
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation SetUserProfile(
              $userId: Int!, 
              $familyName: String!, 
              $givenName: String!, 
              $additionalName: String!, 
              $bio: String,
              $displayFullName: String!, 
              $urls: jsonb!,
              $orcid: String
            ) {
              update_users(
                where: {id: {_eq: $userId}}, 
                _set: {
                  familyName: $familyName, 
                  givenName: $givenName,
                  additionalName: $additionalName, 
                  bio: $bio,
                  displayFullName: $displayFullName,  
                  urls: $urls,
                  orcid: $orcid
                }
              ) {
                returning {
                  bio
                  displayFullName
                  givenName
                  familyName
                  additionalName
                  urls
                  orcid
                }
              }
            }
          `,
          variables: {
            userId: this.userId,
            familyName: this.profile.familyName,
            givenName: this.profile.givenName,
            additionalName: this.profile.additionalName,
            displayFullName: this.profile.displayFullName,
            bio: this.profile.bio,
            urls: this.profile.urls,
            orcid: this.profile.orcid
          }
        })
        this.setProfile(JSON.parse(JSON.stringify(result.data.update_users.returning[0])))
      } catch (error) {
        console.error(error)
      } finally {
        this.saving = false
      }
    },
    setProfile: function (newProfile) {
      this.profile.familyName = newProfile.familyName
      this.profile.givenName = newProfile.givenName
      this.profile.additionalName = newProfile.additionalName
      this.profile.orcid = newProfile.orcid
      this.profile.bio = newProfile.bio
      this.profile.displayFullName = newProfile.displayFullName
      this.profile.urls = newProfile.urls
    }
  }
}
</script>
