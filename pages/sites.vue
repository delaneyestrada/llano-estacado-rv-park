<template>
  <div>
    <b-container class="mt-5">
      <div class="booking-info-sites">
        <div class="warning-container">
          <font-awesome-icon
            class="warning-icon"
            :icon="['fas', 'exclamation-circle']"
          /><strong>IMPORTANT</strong>
        </div>
        <ul>
          <li>
            Your first payment period will be paid upfront to confirm your
            booking.
          </li>
          <li>
            Monthly bookings are prorated from the day chosen to the beginning
            of the next month and continue monthly from the 1st.
          </li>
          <li style="font-weight: bold">
            (For monthly bookings not starting on the first of the month, the
            upfront payment will be the prorated amount instead)
          </li>
        </ul>
      </div>
      <h2 class="header mb-2 mt-5">Book Your Site</h2>
      <ul class="prices">
        <li>
          Monthly: <span>${{ monthlyRate }}</span>
        </li>
        <li>
          Weekly: <span>${{ weeklyRate }}</span>
        </li>
      </ul>
      <section id="site-picker">
        <SiteMap />
      </section>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "Sites",
  computed: {
    monthlyRate() {
      return this.$config.monthlyRate;
    },
    weeklyRate() {
      return this.$config.weeklyRate;
    },
  },

  mounted() {
    this.$store.dispatch("getSites");
  },
};
</script>

<style lang="scss">
.booking-info-sites {
  margin: 2rem 0 0.5rem 0;
  background-color: lighten($light, 10%);
  padding: 1rem 1rem 1rem 3.5rem;
  position: relative;
}

.warning-container {
  .warning-icon {
    position: absolute;
    opacity: 0.2;
    font-size: 3.5rem;
    top: 0;
    left: 0;
    margin: 0.5rem 0 0 0.5rem;
    color: red;
  }
}

.prices {
  padding: 1rem;
  outline: 1px solid $primary;
  display: inline-block;
  li {
    list-style: none;

    span {
      font-weight: 600;
    }
  }
}
</style>