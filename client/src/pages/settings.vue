<template>
  <q-page padding>
    <div class="row">
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
          <!-- <div class="text-h6 text-weight-light text-center">Personal settings</div> -->
          <q-tab name="profile" class="q-px-sm" label="Profile" />
          <q-tab name="account" class="q-px-sm" label="Account" />
          <q-tab name="emails" class="q-px-sm" label="Emails" />
          <q-tab name="security" class="q-px-sm" label="Security" />
          <!-- <q-btn-dropdown auto-close flat label="Personal settings">
            <q-list link>
              <q-item clickable @click="tab = 'profile'">
                <q-item-section>
                  <q-item-section>Profile</q-item-section>
                </q-item-section>
              </q-item>
              <q-item clickable @click="tab = 'account'">
                <q-item-section>
                  <q-item-section>Account</q-item-section>
                </q-item-section>
              </q-item>
              <q-item clickable @click="tab = 'emails'">
                <q-item-section>
                  <q-item-section>Email</q-item-section>
                </q-item-section>
              </q-item>
              <q-item clickable @click="tab = 'security'">
                <q-item-section>
                  <q-item-section>Security</q-item-section>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown> -->
        </q-tabs>
      </div>
      <div class="col-md-9 col-sm-12  col-xs-12">
        <q-tab-panels
          v-model="tab"
        >
          <q-tab-panel name="profile">
            <SettingsProfile/>
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

import SettingsProfile from '../components/settings/settingsProfile.vue';
import SettingsAccount from '../components/settings/settingsAccount.vue';
import SettingsEmails from '../components/settings/settingsEmails.vue';
import SettingsSecurity from '../components/settings/settingsSecurity.vue';

export default {
  components: {
    SettingsProfile,
    SettingsAccount,
    SettingsEmails,
    SettingsSecurity,
  },
  data() {
    return {
      tab: 'profile',
    };
  },
};
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
