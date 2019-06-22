<template>
  <q-page padding>
    <h4 class="text-weight-light no-margin q-py-md text-center">Register</h4>
    <q-card-section class="small-card">
      <q-stepper v-model="step" vertical color="primary" animated>
        <q-step
          :name="1"
          title="Create Account"
          caption="Register to get started and create your account."
          icon="settings"
          :done="step > 1"
        >
          Please provide information about yourself.
          <form
            @submit.prevent.stop="
              onSubmit(['firstName', 'lastName', 'email', 'affiliation'])
            "
            class="q-gutter-md"
          >
            <div class="row">
              <q-input
                required
                class="col-6 q-pr-md"
                ref="firstName"
                filled
                v-model="firstName"
                label="First Name"
                :rules="[val => !!val || 'Field is required']"
              />
              <q-input
                required
                class="col-6"
                ref="lastName"
                filled
                v-model="lastName"
                label="Last Name"
                :rules="[val => !!val || 'Field is required']"
              />
            </div>
            <q-input
              required
              v-model="email"
              filled
              ref="email"
              type="email"
              placeholder="Email"
              :rules="[val => !!val || 'Field is required']"
            />
            <q-input
              required
              v-model="affiliation"
              filled
              ref="affiliation"
              placeholder="Affiliation"
              :rules="[val => !!val || 'Field is required']"
            />

            <q-stepper-navigation>
              <q-btn type="submit" color="primary" label="Continue" />
            </q-stepper-navigation>
          </form>
        </q-step>

        <q-step
          :name="2"
          title="Get Started"
          caption="Learn about the responsibilities of all Databrary members."
          icon="create_new_folder"
          :done="step > 2"
        >
          <h5 class="no-margin">Get Started</h5>
          <p>As a member of the Databrary community, you promise to:</p>
          <ol>
            <li>
              Treat Databrary data with the same high standard of care that you
              treat data collected in your own laboratory.
            </li>
            <li>
              Respect participants' wishes about sharing their data just as you
              do in your lab.
            </li>
            <li>
              Take care in authorizing other people (affiliates and
              collaborators) and take responsibility for their conduct and use
              of Databrary data, just as you do in your own lab.
            </li>
          </ol>
          <p>
            Read the
            <a
              href="http://databrary.org/access/policies/agreement.html"
              target="_blank"
              >Databrary Access Agreement.
            </a>
            You can also download the
            <a
              href="http://databrary.org/policies/agreement.pdf"
              target="_blank"
            >
              full agreement as pdf.
            </a>
          </p>
          <form
            @submit.prevent.stop="onSubmit(['agreeToDAA'])"
            class="q-gutter-md"
          >
            <q-checkbox
              v-model="agreeToDAA"
              color="secondary"
              required
              label="By checking below, you agree that you have read and understand the Databrary
              Access Agreement, and that we may contact the officials at your institution who are
              responsible for executing legal agreements."
            />
            <q-stepper-navigation>
              <q-btn
                :disabled="!agreeToDAA"
                type="submit"
                color="primary"
                label="Continue"
              />
              <q-btn
                flat
                @click="step = 1"
                color="primary"
                label="Back"
                class="q-ml-sm"
              />
            </q-stepper-navigation>
          </form>
        </q-step>

        <q-step
          :name="3"
          title="Confirm Email"
          caption="Confirm your email address to continue."
          icon="assignment"
        >
          <h5 class="no-margin">Confirm Email</h5>
          <p>
            Check your inbox for your email confirmation. You must verify your
            email address to continue.
            <br />
            Your confirmation email has been sent to:
            <b>ryanmasonjar@gmail.com</b>.
          </p>
          <q-stepper-navigation>
            <q-btn
              flat
              @click="step = step - 1"
              color="primary"
              label="Back"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="4"
          title="Set Password"
          caption="Pick a secure password."
          icon="add_comment"
        >
          <h5 class="no-margin">Set Password</h5>
          <p>
            Please set a secure password. Remember that you may not share your
            login information with anyone.
          </p>
          <form
            @submit.prevent.stop="onSubmit(['agreeToDAA'])"
            class="q-gutter-md"
          >
            <q-input
              required
              v-model="password"
              filled
              :type="isPwd ? 'password' : 'text'"
              placeholder="Password"
              class="q-py-md"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <q-stepper-navigation>
              <q-btn type="submit" color="primary" label="Continue" />
              <q-btn
                @click="step = step - 1"
                flat
                color="primary"
                label="Back"
                class="q-ml-sm"
              />
            </q-stepper-navigation>
          </form>
        </q-step>

        <q-step
          :name="5"
          title="Request Authorization"
          caption="Begin the authorization process to gain access to Databrary."
          icon="add_comment"
        >
          <h5 class="no-margin">Request Authorization</h5>
          <form
            @submit.prevent.stop="onSubmit(['agreeToDAA'])"
            class="q-gutter-md"
          >
            <q-stepper-navigation>
              <q-btn type="submit" color="primary" label="Continue" />
              <q-btn
                @click="step = step - 1"
                flat
                color="primary"
                label="Back"
                class="q-ml-sm"
              />
            </q-stepper-navigation>
          </form>
        </q-step>

        <q-step
          :name="6"
          title="Submit Authorization"
          caption="Confirm your authorization request."
          icon="add_comment"
        >
          <h5 class="no-margin">Submit Authorization</h5>
          <form
            @submit.prevent.stop="onSubmit(['agreeToDAA'])"
            class="q-gutter-md"
          >
            <q-stepper-navigation>
              <q-btn type="submit" color="primary" label="Continue" />
              <q-btn
                @click="step = step - 1"
                flat
                color="primary"
                label="Back"
                class="q-ml-sm"
              />
            </q-stepper-navigation>
          </form>
        </q-step>

        <q-step
          :name="7"
          title="Completed Stay Tuned"
          caption="Stay tuned for tips for exploring Databrary."
          icon="add_comment"
        >
          <h5 class="no-margin">Completed</h5>
          <form
            @submit.prevent.stop="onSubmit(['agreeToDAA'])"
            class="q-gutter-md"
          >
            <q-stepper-navigation>
              <q-btn type="submit" color="primary" label="Finish" />
              <q-btn
                @click="step = step - 1"
                flat
                color="primary"
                label="Back"
                class="q-ml-sm"
              />
            </q-stepper-navigation>
          </form>
        </q-step>
      </q-stepper>
    </q-card-section>
  </q-page>
</template>

<script>
export default {
  name: 'register',
  data() {
    return {
      step: 1,
      firstName: null,
      lastName: null,
      email: null,
      affiliation: null,
      agreeToDAA: false,
      password: null,
      isPwd: true,
    };
  },
  methods: {
    /**
     * Validate data coming in from registration form
     * @param {Array} fields an array of fields to validate
     * */
    // TODO: finish
    onSubmit() {
      this.step = this.step + 1;
    },
  },
};
</script>
<style scoped>
.small-card {
  max-width: 800px;
  margin: auto;
}
</style>
