<template>
  <div id="contact">
    <b-container>
      <h2 class="header mt-5 mb-2">Contact Us</h2>
      <b-card>
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
          <recaptcha class="mb-3" />
          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
      </b-card>
    </b-container>
    <b-modal id="error-modal" hide-footer title="Contact Form Error">
      <p class="my-2">
        There was an error sending the message. Please try again.
      </p>
    </b-modal>
    <b-modal id="success-modal" hide-footer title="Message Sent">
      <p class="my-2">
        Your message was sent. We will get back to you as soon as possible.
      </p>
    </b-modal>
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
    async onSubmit() {
      try {
        const token = await this.$recaptcha.getResponse();

        this.$axios
          .post(`${this.$config.functionsURL}/webApi/contact-email`, {
            data: { form: this.form, token: token },
          })
          .then((res) => {
            console.log(res);
          })
          .catch((e) => {
            console.log(e);
          });

        await this.$recaptcha.reset();
        this.$bvModal.show("success-modal");
      } catch (e) {
        this.$bvModal.show("error-modal");
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss">
</style>