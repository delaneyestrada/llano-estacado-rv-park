<template>
  <div>
    <b-card>
      <div class="content" v-if="reservationDetails && bookingDetails">
        <p class="my-4">
          You are about to rent site {{ reservationDetails.site }} from
          {{ bookingDetails.startDate.format("MM-DD-YYYY") }} through
          {{ bookingDetails.endDate.format("MM-DD-YYYY") }}.
        </p>

        <b-table
          :items="billingData"
          :fields="fields"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          :sort-direction="sortDirection"
          table-variant="light"
          stacked="md"
          show-empty
          striped
          small
        >
        </b-table>
        <p class="my-4">Select a payment method below.</p>
        <b-spinner v-if="!paypalLoaded" />
        <PayPal
          @loaded="() => (paypalLoaded = true)"
          :monthlyRate="monthlyRate"
          @success="onSubscribeSuccess"
        />
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

      paypalLoaded: false,
      monthlyRate: 100.0,
    };
  },
  computed: {
    ...mapState({
      reservationDetails: (state) => state.reservationDetails,
      bookingDetails: (state) => state.bookingDetails,
    }),
    startDateFormatted() {
      return this.$dayjs(this.reservationDetails.startDate).format(
        "MM/DD/YYYY"
      );
    },
    billingData() {
      let data = [];
      const startDate = this.$dayjs(this.reservationDetails.startDate);
      const {
        interval,
        nextIntervalStart,
        numDaysNextInterval,
        proratedCharge,
        immediate,
      } = this.bookingDetails;
      // const numMonths = this.reservationDetails.numMonths;
      // const startNextMonth = startDate.add(1, "month").date(1);
      // const numDaysUntilNextMonth = startNextMonth.diff(startDate, "day");
      // const daysInMonth = startDate.daysInMonth();
      // let proratedCharge =
      //   (numDaysUntilNextMonth / daysInMonth) * this.monthlyRate;
      // proratedCharge = proratedCharge.toFixed(2);
      data.push({
        paymentDate: "Now",
        paymentAmount: `$${
          interval == "weekly"
            ? this.$config.weeklyRate
            : this.$config.monthlyRate
        }`,
      });

      if (!immediate) {
        data.push({
          paymentDate: startDate.format("MM/DD/YYYY"),
          paymentAmount: `$${proratedCharge}`,
        });
      }

      if (interval == "weekly") {
        getPaymentTableInfo(
          interval,
          this.reservationDetails.numWeeks,
          this.$config.weeklyRate
        );
      } else if (interval == "monthly") {
        getPaymentTableInfo(
          interval,
          this.reservationDetails.numMonths,
          this.$config.monthlyRate
        );
      } else {
        alert("error");
      }
      function getPaymentTableInfo(interval, numIntervals, rate) {
        const intervalMap = {
          weekly: "week",
          monthly: "month",
        };

        for (let i = 0; i < numIntervals; i++) {
          data.push({
            paymentDate: nextIntervalStart
              .add(i, intervalMap[interval])
              .format("MM/DD/YYYY"),
            paymentAmount: `$${i == 0 ? 0 : rate}`,
          });
        }
      }
      return data;
    },
  },
  beforeDestroy() {
    this.$store.dispatch("removeReservationNav");
  },
  methods: {
    onSubscribeSuccess(e) {
      const db = this.$fire.firestore;
      const FieldValue = this.$fireModule.firestore.FieldValue;

      const data = e;

      db.collection("sites")
        .doc(data.site.toString())
        .update("booked", FieldValue.arrayUnion(data.bookDates));

      db.collection("sites")
        .doc(data.site.toString())
        .collection("bookings")
        .doc()
        .set({
          site: data.site,
          paypalSubscriptionID: data.subscriptionID,
          startDate: data.startDate,
          endDate: data.endDate,
          interval: data.interval,
          numIntervals: data.numIntervals,
          status: "Initiated",
          admin: {
            uid: data.user.uid,
            userEmail: data.user.email,
            userName: data.user.name,
          },
        });
      console.log(this.sendConfirmationEmail(data));

      this.$router.push({ name: "success", params: e });
    },
    sendConfirmationEmail(data) {
      return this.$axios
        .post(`${this.$config.functionsURL}/webApi/confirmation-email`, {
          data: data,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  max-width: 750px;
  margin: 0;
}
</style>