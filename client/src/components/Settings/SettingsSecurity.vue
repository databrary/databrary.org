<template>
  <div>
    <div class="text-h4 q-mb-md">Security</div>
      <q-banner v-if=!showTwoFactor rounded class="bg-red-5 text-white">
        <template v-slot:avatar>
          <q-avatar icon="lock" color="white" text-color="red-5" />
        </template>
        <div class="text-h6">Two factor authentication is not enabled yet.</div>
          Two-factor authentication adds an additional layer of security to your account by
          requiring more than just a password to log in.
        <template v-slot:action>
          <q-btn
            @click="showTwoFactor= true"
            flat
            color="white"
            label="Enable two-factor authentication"
          />
        </template>
      </q-banner>
      <div v-else class="row">
        <p>
          Two-factor authentication adds an extra layer of security to your account.
          In addition to your username and password, you’ll need to enter a code that
          we sends to you via text or an app on your phone.
        </p>
        <div class="col-xs-12 col-sm-12 col-md-6 q-pa-sm">
          <q-card flat bordered class="my-card">
            <q-card-section>
              <div class="text-h6">Use an application</div>
              On your phone to get two-factor authentication codes when prompted.
              <q-separator class="q-my-md" inset/>
              <div class="text-right">
                <q-btn color="primary" label="Setup using an app" />
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 q-pa-sm">
          <q-card flat bordered class="my-card">
            <q-card-section>
              <div class="text-h6">Use SMS</div>
                We will send you an SMS with a two-factor authentication code when prompted.
              <q-separator class="q-my-md" inset/>
              <div class="text-right">
                <q-btn
                  color="info"
                  label="Setup using SMS"
                  @click="showTwoFactorSetup = true"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
          <div class="q-pa-md q-gutter-sm">
            <q-dialog v-model="showTwoFactorSetup">
              <q-layout view="Lhh lpR fff" container class="bg-white">
                <q-header>
                  <q-toolbar>
                    <q-toolbar-title>Enable SMS two-factor authentication</q-toolbar-title>
                  </q-toolbar>
                </q-header>

                <q-footer class="bg-white">
                  <q-toolbar>
                    <q-btn
                      color="positive"
                      label="Enable"
                      disabled
                    />
                  </q-toolbar>
                </q-footer>

                <q-page-container>
                  <q-page padding>
                    <q-select
                      v-model="selectedCountryCode"
                      :options="countryCodes"
                      label="Country code"
                    />
                    <q-input type="tel" hint="Phone number" />
                    <q-btn
                      color="primary"
                      class="q-mt-md"
                      label="Send authentication code"
                    />
                    <q-separator class="q-my-md" inset/>
                    <q-input type="tel" label="Enter the six-digit code sent to your phone" />

                  </q-page>
                </q-page-container>
              </q-layout>
            </q-dialog>
          </div>
      </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      showTwoFactor: false,
      showTwoFactorSetup: false,
      selectedCountryCode: 'United States +1',
      countryCodes: [
        'United States +1', 'Aland Islands +358', 'Algeria +213', 'Angola +244', 'Anguilla +1264',
        'Australia +61', 'Austria +43', 'Bahamas +1', 'Bahrain +973', 'Bangladesh +880',
        'Belarus +375', 'Belgium +32', 'Benin +229', 'Bolivia +591', 'Bosnia and Herzegovina +387',
        'Brunei +673', 'Bulgaria +359', 'Burundi +257', 'Cambodia +855', 'Canada +1',
        'Cape Verde +238', 'Cayman Islands +1345', 'Christmas Island +61', 'Cocos +61',
        'Congo, Dem Rep +243', 'Croatia +385', 'Cyprus +357', 'Czech Republic +420', 'Denmark +45',
        'Dominica +1767', 'Dominican Republic +1', 'Ecuador +593', 'Equatorial Guinea +240',
        'Estonia +372', 'Finland/Aland Islands +358', 'France +33', 'Gambia +220', 'Georgia +995',
        'Germany +49', 'Ghana +233', 'Gibraltar +350', 'Greece +30', 'Guatemala +502',
        'Guyana +592', 'Hungary +36', 'Iceland +354', 'Indonesia +62', 'Iran +98', 'Ireland +353',
        'Israel +972', 'Italy +39', 'Ivory Coast +225', 'Jamaica +1876', 'Japan +81',
        'Jordan +962', 'Kazakhstan +7', 'Kuwait +965', 'Latvia +371', 'Libya +218',
        'Liechtenstein +423', 'Lithuania +370', 'Luxembourg +352', 'Madagascar +261',
        'Malawi +265', 'Malaysia +60', 'Maldives +960', 'Mali +223', 'Malta +356',
        'Mauritius +230', 'Mexico +52', 'Monaco +377', 'Montenegro +382', 'Montserrat +1664',
        'Mozambique +258', 'Namibia +264', 'Netherlands +31', 'Netherlands Antilles +599',
        'New Zealand +64', 'Nigeria +234', 'Norway +47', 'Philippines +63', 'Poland +48',
        'Portugal +351', 'Qatar +974', 'Romania +40', 'Russia +7', 'Rwanda +250', 'Senegal +221',
        'Serbia +381', 'Seychelles +248', 'Singapore +65', 'Slovakia +421', 'Slovenia +386',
        'South Africa +27', 'South Korea +82', 'Spain +34', 'Sri Lanka +94', 'St Lucia +1758',
        'Sudan +249', 'Sweden +46'
      ]
    }
  }
}
</script>

<style>

</style>
