<template>
  <div>
    <div class="text-h4 q-mb-md">Account</div>
    <div class="text-h5">Change password</div>
    <hr>
    <q-input
      outlined
      dense
      label="Old password:"
    />
    <q-input
      outlined
      dense
      label="New password:"
      class="q-pt-md"
      v-model="newPassword"
    />
    <q-input
      outlined
      dense
      label="Confirm new password:"
      class="q-py-md"
      v-model="confirmNewPassword"
    />
    <q-btn color="primary" label="Update password" v-on:click="validatePassword()"/>
  </div>
</template>
<script>
export default {
  data() {
    return {
      newPassword: '',
      confirmNewPassword: '',
    };
  },
  methods: {
    validatePassword() {
      console.log(this.newPassword.length);
      if (this.newPassword !== this.confirmNewPassword
        || this.newPassword.length === 0
      ) {
        this.$q.notify({
          message: 'Error: new password does not match',
          color: 'red-5',
        });
      }
    },
  },
};
</script>
