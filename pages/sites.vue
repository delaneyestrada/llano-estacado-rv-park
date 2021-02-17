<template>
  <div>
    <b-container class="mt-5">
      <div class="booking-info-sites">
        <strong>Important</strong>
        <ul>
          <li>
            Your first payment period will be paid upfront to confirm your
            booking.
          </li>
          <li>
            Monthly bookings are prorated to the beginning of the next month.
          </li>
        </ul>
      </div>
      <h2 class="header mb-2">Book Your Site</h2>
      <section id="site-picker">
        <SiteMap />
      </section>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "Sites",

  mounted() {
    this.$store.dispatch("getSites");
  },
};
</script>

<style lang="scss">
.booking-info-sites {
  margin: 2rem 0 0.5rem 0;
  background-color: lighten($light, 10%);
  padding: 1rem;
}
</style>