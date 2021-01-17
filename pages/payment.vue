<template>
  <div>
    <b-card>
      <div class="content" v-if="reservationDetails">
        <p class="my-4">
          You are about to rent site {{ reservationDetails.site }} starting on
          {{ reservationDetails.startDate }} for
          {{ reservationDetails.numMonths }} months.
        </p>
        <p class="my-4">Select a payment method below.</p>
        <PayPal @success="onSubscribeSuccess" />
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "payment",
  computed: {
    ...mapState({
      reservationDetails: (state) => state.reservationDetails,
    }),
  },
  methods: {
    onSubscribeSuccess() {
      this.$router.push("/success");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>