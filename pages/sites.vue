<template>
  <div>
    <b-container>
      <h2 class="header mt-5 mb-2">Book Your Site</h2>
      <section id="site-picker">
        <img src="https://via.placeholder.com/1920x1080" alt="" />
        <b-card>
          <b-form @submit="onSubmit" @reset="onReset">
            <b-form-group
              id="input-group-1"
              label="Email address:"
              label-for="input-1"
              description="We'll never share your email with anyone else."
            >
              <b-form-input
                id="input-1"
                type="email"
                placeholder="Enter email"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-2"
              label="Your Name:"
              label-for="input-2"
            >
              <b-form-input
                id="input-2"
                placeholder="Enter name"
                required
              ></b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary">Submit</b-button>
          </b-form>
        </b-card>
      </section>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "Sites",
};
</script>

<style lang="scss">
#site-picker {
  display: grid;
  grid-template-columns: 2fr 1fr;
  img {
    width: 100%;
  }
  .card {
    color: $white;
    border-radius: 0;
  }
}
</style>