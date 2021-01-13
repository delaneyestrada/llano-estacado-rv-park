<template>
  <div id="contact">
    <b-container>
      <h2 class="header mt-5 mb-2">Contact Us</h2>
      <b-form @submit.prevent="onSubmit">
        <b-form-group label="Name:" label-for="name-input">
          <b-form-input
            id="name-input"
            v-model="form.name"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Email Address:" label-for="email-input">
          <b-form-input
            id="email-input"
            v-model="form.email"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Message:" label-for="message-input">
          <b-form-textarea
            id="message-input"
            v-model="form.message"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "contact",
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: "",
      },
    };
  },
  methods: {
    onSubmit(e) {
      console.log(e);
    },
  },
};
</script>

<style lang="scss">
</style>