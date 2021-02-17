<template>
  <div>
    <b-button
      type="button"
      variant="danger"
      v-b-modal="`booking-modal${subscriptionID}`"
      size="sm"
    >
      Cancel
    </b-button>
    <b-modal
      :id="`booking-modal${subscriptionID}`"
      hide-header
      ok-title="Cancel booking"
      ok-variant="danger"
      cancel-title="Back"
      cancel-variant="primary"
      v-on:ok="handleSubmit"
      v-if="subscriptionID && site"
    >
      <p v-if="!manual">
        Cancelling the booking will not cancel their PayPal payments. Use
        subscription ID
        <strong>{{ subscriptionID }}</strong> to find the subscription on the
        PayPal dashboard to cancel it.
      </p>
      <p v-else>
        This booking was done manually. Make sure to handle payment on your end
        as well.
        <span class="d-block"
          >Subscription ID: <strong>{{ subscriptionID }}</strong></span
        >
      </p>
      <strong>This can not be undone.</strong>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "CancelModal",
  props: ["subscriptionID", "site", "manual"],
  methods: {
    handleSubmit() {
      const cancelData = {
        subscriptionID: this.subscriptionID,
        site: this.site,
        manual: this.manual ? true : false,
      };
      console.log(cancelData);
      this.$emit("cancel", cancelData);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>