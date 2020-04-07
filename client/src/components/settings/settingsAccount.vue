<template>
  <div>
    <div class="text-h4 q-mb-md">Account</div>
    <div class="text-h5">Change password</div>
    <form @submit.prevent="validateAndResetPassword">
    <hr>
        <q-input
          disable
          type="password"
          name="password"
          outlined
          dense
          label="Old password:"
          v-model="password"
        />
        <q-input
          type="password"
          name="password-new"
          outlined
          dense
          label="New password:"
          class="q-pt-md"
          v-model="newPassword"
        />
        <q-input
          type="password"
          name="password-confirm"
          outlined
          dense
          label="Confirm new password:"
          class="q-py-md"
          v-model="confirmNewPassword"
        />
        <q-btn type="submit" color="primary" label="Update password" name="submitAction"/>
        <!-- <q-btn color="primary" label="Update password" v-on:click="validateAndResetPassword()"/> -->
    </form>
  </div>
</template>
<script>
import axios from 'axios'
import { get } from 'vuex-pathify'
export default {
  data () {
    return {
      password: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  },
  computed: {
    sessionId: get('app/sessionId')
  },
  methods: {
    async validateAndResetPassword () {
      console.log(this.newPassword.length)
      if (this.newPassword !== this.confirmNewPassword ||
        this.newPassword.length === 0) {
        this.$q.notify({
          message: 'Error: new password does not match',
          color: 'red-5'
        })
      } else {
        const payload = {
          'password': this.password,
          'password-new': this.newPassword,
          'password-confirm': this.confirmNewPassword
        }
        await axios({ url: '/password', method: 'POST', data: payload })
          .then(result => {
            this.$q.notify({
              message: 'Password Updated',
              color: 'green-5'
            })
          }).catch(error => {
            console.log(error)
          })
      }
    }
  }
}
</script>
