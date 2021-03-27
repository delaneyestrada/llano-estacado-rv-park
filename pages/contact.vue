<template>
  <div id="contact">
    <b-container>
      <h2 class="header mt-5 mb-2">Contact Us</h2>
      <b-card>
        <b-form @submit.prevent="onSubmit">
          <!-- <b-form
          name="contact"
          id="contact-form"
          method="POST"
          data-netlify="true"
          enctype="application/x-www-form-urlencoded"
          v-on:submit.prevent="handleFormSubmit"
        > -->
          <b-form-group label="Name" label-for="name-input">
            <b-form-input
              id="name-input"
              v-model="form.name"
              name="name"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Email Address" label-for="email-input">
            <b-form-input
              id="email-input"
              v-model="form.email"
              name="email"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Message" label-for="message-input">
            <b-form-textarea
              id="message-input"
              v-model="form.message"
              name="message"
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
    // encode(data) {
    //   const formData = new FormData();

    //   for (const key of Object.keys(data)) {
    //     formData.append(key, data[key]);
    //   }

    //   return formData;
    // },
    // handleFormSubmit(e) {
    //   const axiosConfig = {
    //     header: { "Content-Type": "application/x-www-form-urlencoded" },
    //   };

    //   this.$axios
    //     .post(
    //       location.href,
    //       this.encode({
    //         "form-name": e.target.getAttribute("name"),
    //         ...this.formData,
    //       }),
    //       axiosConfig
    //     )
    //     .then((data) => console.log(data))
    //     .catch((error) => console.log(error))
    //     .then(
    //       (document.getElementById("contact-form").innerHTML = `
    //         <div>
    //             Thank you! We've received your message and will be in touch as soon as possible.
    //         </div>
    //         `)
    //     );
    // },
    async onSubmit() {
      try {
        const token = await this.$recaptcha.getResponse();

        this.$axios
          .post(`${this.$config.functionsURL}/webApi/contact-email`, {
            data: { form: this.form, token: token },
          })
          .then(() => {
            this.$bvModal.show("success-modal");
          })
          .catch((e) => {
            this.$bvModal.show("error-modal");
            console.log(e);
          });

        await this.$recaptcha.reset();
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