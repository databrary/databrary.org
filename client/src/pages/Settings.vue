<template>
  <q-page padding>
    <div class="row max-page-width">
      <div class="col-md-3 col-sm-12 col-xs-12">
        <q-tabs
          v-model="tab"
          vertical
          indicator-color="primary"
          class="gt-sm"
        >
          <div class="text-h6 text-weight-light text-center">Personal settings</div>
          <q-separator inset />
          <q-tab name="profile"  label="Profile" />
          <q-separator inset />
          <q-tab name="account"  label="Account" />
          <q-separator inset />
          <q-tab name="emails"  label="Emails" />
          <q-separator inset />
          <q-tab name="security"  label="Security" />
          <q-separator inset />
        </q-tabs>
        <!-- Mobile -->
        <q-tabs
          class="lt-md"
          v-model="tab"
          indicator-color="primary"
          dense
        >
          <q-tab name="profile" class="q-px-sm" label="Profile" />
          <q-tab name="account" class="q-px-sm" label="Account" />
          <q-tab name="emails" class="q-px-sm" label="Emails" />
          <q-tab name="security" class="q-px-sm" label="Security" />
        </q-tabs>
      </div>
      <div class="col-md-9 col-sm-12  col-xs-12">
        <q-tab-panels
          v-model="tab"
        >
          <q-tab-panel name="profile">
            <SettingsProfile ref="settingsProfile" />
          </q-tab-panel>

          <q-tab-panel name="account">
            <SettingsAccount/>
              <div class="text-caption q-pt-sm">
                Looking for two-factor authentication? You can find it in
                <q-btn
                  @click="tab = 'security'"
                  class="btn-link"
                  flat
                  type="a"
                  color="primary"
                >
                Security
              </q-btn>.
            </div>
          </q-tab-panel>

          <q-tab-panel name="emails">
            <SettingsEmails/>
          </q-tab-panel>

          <q-tab-panel name="security">
            <SettingsSecurity/>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script>
import { get } from 'vuex-pathify'
import SettingsProfile from '../components/settings/SettingsProfile'
import SettingsAccount from '../components/settings/SettingsAccount'
import SettingsEmails from '../components/settings/SettingsEmails'
import SettingsSecurity from '../components/settings/SettingsSecurity'

export default {
  components: {
    SettingsProfile,
    SettingsAccount,
    SettingsEmails,
    SettingsSecurity
  },
  data () {
    return {
      tab: 'profile'
    }
  },
  watch: {
    tab (newTab, oldTab) {
      if (oldTab === 'profile') {
        if (!this.isProfileSaved) {
          this.confirm(newTab, oldTab)
        }
      }
    }
  },
  computed: {
    isProfileSaved: get('profile/isSaved')
  },
  methods: {
    confirm (newTab, oldTab) {
      const answer = window.confirm('You have unsaved changes! Would you like to save your changes?')
      if (answer) {
        this.$refs.settingsProfile.save()
        this.tab = newTab
      } else {
        this.tab = oldTab
      }
    }
  }
}
</script>
<style>
.btn-link {
  padding: 0;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.25rem;
  letter-spacing: 0.03333em;
  text-transform: lowercase;
}
</style>
