<template>
  <div>
    <b-card>
      <div class="content" v-if="reservationDetails">
        <p class="my-4">
          You are about to rent site {{ reservationDetails.site }} starting on
          {{ startDateFormatted }} for
          {{ reservationDetails.numMonths }} months.
        </p>
        <b-table
          :items="billingData"
          :fields="fields"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          :sort-direction="sortDirection"
          table-variant="secondary"
          stacked="md"
          show-empty
          small
        >
        </b-table>
        <p class="my-4">Select a payment method below.</p>
        <PayPal :monthlyRate="monthlyRate" @success="onSubscribeSuccess" />
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "payment",
  data() {
    return {
      fields: [
        { key: "paymentDate", label: "Payment Date" },
        { key: "paymentAmount", label: "Payment Amount" },
      ],
      sortBy: "paymentDate",
      sortDesc: false,
      sortDirection: "asc",
      monthlyRate: 100.0,
    };
  },
  computed: {
    ...mapState({
      reservationDetails: (state) => state.reservationDetails,
    }),
    startDateFormatted() {
      return this.$dayjs(this.reservationDetails.startDate).format(
        "MM/DD/YYYY"
      );
    },
    billingData() {
      let data = [];
      const startDate = this.$dayjs(this.reservationDetails.startDate);
      const numMonths = this.reservationDetails.numMonths;
      const startNextMonth = startDate.add(1, "month").date(1);
      const numDaysUntilNextMonth = startNextMonth.diff(startDate, "day");
      const daysInMonth = startDate.daysInMonth();
      let proratedCharge =
        (numDaysUntilNextMonth / daysInMonth) * this.monthlyRate;
      proratedCharge = proratedCharge.toFixed(2);

      data.push({
        paymentDate: startDate.format("MM/DD/YYYY"),
        paymentAmount: `$${proratedCharge}`,
      });
      for (let i = 0; i < numMonths; i++) {
        data.push({
          paymentDate: startNextMonth.add(i, "month").format("MM/DD/YYYY"),
          paymentAmount: `$${this.monthlyRate}`,
        });
      }
      return data;
    },
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