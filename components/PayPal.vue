<template>
  <div>
    <div ref="paypal"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { paypalWeekly, paypalMonthly } from "../util/paypal-helper";

export default {
  name: "PayPal",
  data() {
    return {
      loaded: false,
      paidFor: false,
    };
  },
  props: {
    monthlyRate: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapState(["authUser", "reservationDetails", "bookingDetails"]),
  },
  mounted: function () {
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AXgplH_FFZXB5FWHAhjurvcisj0uXHjyHAQvUnrjlUmSD7g5E4kNTU60nNCEttnFSNYYdhlkv99e0f77&vault=true&intent=subscription";
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
  },
  methods: {
    setLoaded: async function () {
      this.$emit("loaded");
      if (this.reservationDetails.submitState == "Submitted") {
        const token = await this.$fire.auth.currentUser.getIdToken(true);
        const response = await this.$axios.get(
          `${this.$config.functionsURL}/webApi/check-auth`,
          {
            headers: {
              "Authorization": token,
            },
          }
        );
        const { success } = response.data;
        if (!success) {
          this.$router.push("/sites");
        }

        const { monthlyRate, weeklyRate } = this.$config;
        const {
          proratedCharge,
          numDaysNextInterval,
          interval,
          numIntervals,
          immediate,
          paymentStart,
        } = this.bookingDetails;
        let { startDate, endDate } = this.bookingDetails;

        startDate = setEndOfDay(startDate);
        endDate = setEndOfDay(endDate);

        function setEndOfDay(day) {
          const dayUtc = day.utc(true).utcOffset(0);
          return dayUtc.hour(23).minute(59).second(59).millisecond(999);
        }
        this.loaded = true;

        const config = {
          reservationDetails: this.reservationDetails,
          startDate,
          endDate,
          paymentStart,
          proratedCharge: proratedCharge,
          immediate,
        };

        const monthlyConfig = {
          ...config,
          numDaysUntilNextMonth: numDaysNextInterval,
          monthlyRate,
        };

        const weeklyConfig = {
          ...config,
          numDaysUntilNextWeek: numDaysNextInterval,
          weeklyRate,
        };
        window.paypal
          .Buttons({
            createSubscription: (data, actions) => {
              if (interval == "monthly") {
                return actions.subscription.create(
                  paypalMonthly(monthlyConfig)
                );
              } else if (interval == "weekly") {
                return actions.subscription.create(paypalWeekly(weeklyConfig));
              } else {
                return null;
              }
            },
            onApprove: async (data, actions) => {
              const db = this.$fire.firestore;
              const authUser = this.$fire.auth.currentUser;

              const fbUser = await db
                .collection("users")
                .doc(authUser.uid)
                .get()
                .then((documentSnapshot) => {
                  return documentSnapshot.data();
                });

              const user = { ...fbUser, uid: authUser.uid };
              try {
                db.collection("users")
                  .doc(user.uid)
                  .collection("subscriptions")
                  .doc()
                  .set({
                    admin: {
                      uid: user.uid,
                      userEmail: user.email,
                      userName: user.name,
                    },
                    id: data.subscriptionID,
                    status: "Initiated",
                    site: this.reservationDetails.site,
                  });
              } catch (e) {
                console.log("add subscription error", e);
              }

              const bookDates = {
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                paypalSubscriptionID: data.subscriptionID,
              };

              const successData = {
                site: this.reservationDetails.site,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                interval,
                numIntervals,
                user: user,
                bookDates: bookDates,
                subscriptionID: data.subscriptionID,
              };
              this.paidFor = true;
              this.$emit("success", successData);
            },
            onError: (err) => {
              console.log(err);
            },
          })
          .render(this.$refs.paypal);
      } else {
        alert("Choose a start and end date to book your reservation");
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>