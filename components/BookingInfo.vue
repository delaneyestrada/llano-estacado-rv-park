<template>
  <div>
    <div class="booking-info" v-if="bData">
      <div class="columns">
        <ul class="booking-container">
          <li class="data-container" v-if="bData.site">
            <div class="label">Site:</div>
            <div class="data">{{ bData.site }}</div>
          </li>
          <li class="data-container" v-if="bData.user.name">
            <div class="label">Booked by:</div>
            <div class="data">{{ bData.user.name }}</div>
          </li>
          <li class="data-container" v-if="bData.user.email">
            <div class="label">Booker's email:</div>
            <div class="data">{{ bData.user.email }}</div>
          </li>
          <li class="data-container" v-if="bData.user.paymentStatus">
            <div class="label">Payment status:</div>
            <div class="data">{{ bData.user.paymentStatus }}</div>
          </li>
          <li class="data-container" v-if="bData.user.subscriptionID">
            <div class="label">Subscription ID:</div>
            <div class="data">{{ bData.user.subscriptionID }}</div>
          </li>
          <li class="data-container" v-if="bData.range.start">
            <div class="label">From:</div>
            <div class="data">{{ bData.range.start }}</div>
          </li>
          <li class="data-container" v-if="bData.range.end">
            <div class="label">To:</div>
            <div class="data">{{ bData.range.end }}</div>
          </li>
        </ul>
      </div>
      <CancelModal
        :subscriptionID="bData.user.subscriptionID"
        :site="bData.site"
        :manual="bData.manual"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script>
import CancelModal from "@/components/CancelModal";

export default {
  name: "BookingInfo",
  props: ["bookingData", "site", "table"],
  components: {
    CancelModal,
  },
  computed: {
    bData() {
      if (this.table) {
        const data = {
          user: {
            name: this.bookingData.admin.userName,
            email: this.bookingData.admin.userEmail,
            paymentStatus: this.bookingData.status,
            subscriptionID: this.bookingData.paypalSubscriptionID,
          },
          site: this.bookingData.site,
          manual: this.bookingData.status == "Manual" ? true : false,
          range: {
            end: this.formatDate(this.bookingData.endDate),
            start: this.formatDate(this.bookingData.startDate),
          },
        };
        return data;
      } else {
        return {
          ...this.bookingData,
          site: this.site,

          manual:
            this.bookingData.user.paymentStatus == "Manual" ? true : false,
          range: {
            end: this.formatDate(this.bookingData.range.end),
            start: this.formatDate(this.bookingData.range.start),
          },
        };
      }
    },
  },
  methods: {
    formatDate(date) {
      return this.$dayjs(date).format("MM-DD-YYYY");
    },
    handleCancel(data) {
      this.$emit("cancel", data);
    },
  },
};
</script>

<style lang="scss" scoped>
.booking-container {
  padding: 0;
}
.booking-info {
  padding: 0.7em;

  @media screen and (max-width: 500px) {
    font-size: 14px;
  }
  @media screen and (max-width: 400px) {
    font-size: 13px;
  }
}
.data-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  border: 1px solid black;
  padding: 0.5em;
  .label {
    font-size: 1em;
  }
  .data {
    margin-left: 1em;
    text-align: left;
    font-size: 0.9em;
  }
}
</style>