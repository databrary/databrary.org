<template>
  <q-page padding class="text-center">
    <h4 class="text-weight-light no-margin q-py-md">Login</h4>
    <q-card class="my-card small-card">
      <q-card-section>
        <div v-if="fogotPassword != true">
          <q-input v-model="email" filled type="email" placeholder="Email" />
          <q-input
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
          <div class="q-pt-md q-gutter-sm">
            <q-btn
              to="/register"
              exact
              color="white"
              text-color="gray"
              label="Register"
            />
            <q-btn color="primary" label="Login" />
            <br/>
            <q-btn @click="fogotPassword = true" flat color="primary" label="Forgot password" />
          </div>
        </div>
        <div v-else>
          <h5 class="text-weight-light no-margin q-py-md">Forgot password</h5>
          <p>
            Enter the last known email address and will
            send you a recovery email to reset your password
          </p>
          <q-input
            v-model="email"
            filled
            placeholder="Email"
            class="q-py-md"
          />
          <q-btn @click="fogotPassword = false" flat color="primary" label="Recover password" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      email: null,
      password: null,
      isPwd: true,
      fogotPassword: false,
    };
  },
};
</script>

<style scoped>
.small-card {
  max-width: 500px;
  margin: auto;
}
</style>
