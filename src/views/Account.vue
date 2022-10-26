<template>
  <div>
    <p>Welcome to your account</p>
    <InputField v-model="username" inputLabel="email" inputType="text" />

    <InputField v-model="password" inputLabel="password" inputType="password" />
  </div>
</template>

<script>
import InputField from "@/components/base/InputField.vue";

export default {
  components: {
    InputField
  },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  watch: {
    username(username, oldUsername) {
      console.log(`new username is ${username}`);
      console.log(`old username is ${oldUsername}`);
    },
    password(password, oldpassword) {
      console.log(`new password is ${password}`);
      console.log(`old password is ${oldpassword}`);
    }
  }
};
</script>
