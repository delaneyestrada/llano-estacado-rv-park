<template>
  <div>
    <div ref="paypal"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";

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
    ...mapState(["authUser", "reservationDetails"]),
  },
  mounted: function () {
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AXgplH_FFZXB5FWHAhjurvcisj0uXHjyHAQvUnrjlUmSD7g5E4kNTU60nNCEttnFSNYYdhlkv99e0f77&vault=true&intent=subscription";
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
  },
  methods: {
    setLoaded: function () {
      if (this.reservationDetails.submitState == "Submitted") {
        const monthlyRate = 100.0;
        const startDate = this.$dayjs(this.reservationDetails.startDate);
        const startNextMonth = startDate.add(1, "month").date(1);
        console.log(startDate, startNextMonth);
        const numDaysUntilNextMonth = startNextMonth.diff(startDate, "day");
        const daysInMonth = startDate.daysInMonth();
        let proratedCharge =
          (numDaysUntilNextMonth / daysInMonth) * monthlyRate;
        proratedCharge = proratedCharge.toFixed(2);
        console.log(proratedCharge);
        console.log(numDaysUntilNextMonth);
        this.loaded = true;
        window.paypal
          .Buttons({
            createSubscription: (data, actions) => {
              return actions.subscription.create({
                "plan_id": "P-0K585564PM541093LMAHLK5Q",
                "custom_id": this.reservationDetails.site,
                "start_time": startDate.toISOString(),
                "plan": {
                  "product_id": "rv-spot",
                  "name": "RV Reservation",
                  "description": "RV Reservation",
                  "billing_cycles": [
                    {
                      "pricing_scheme": {
                        "version": 1,
                        "fixed_price": {
                          "currency_code": "USD",
                          "value": proratedCharge,
                        },
                      },
                      "frequency": {
                        "interval_unit": "DAY",
                        "interval_count": numDaysUntilNextMonth,
                      },
                      "tenure_type": "TRIAL",
                      "sequence": 1,
                      "total_cycles": 1,
                    },
                    {
                      "pricing_scheme": {
                        "version": 1,
                        "fixed_price": {
                          "currency_code": "USD",
                          "value": monthlyRate.toString(),
                        },
                      },
                      "frequency": {
                        "interval_unit": "MONTH",
                        "interval_count": 1,
                      },
                      "tenure_type": "REGULAR",
                      "sequence": 2,
                      "total_cycles": this.reservationDetails.numMonths.toString(),
                    },
                  ],
                },
              });
            },
            onApprove: async (data, actions) => {
              const db = this.$fire.firestore;
              const FieldValue = this.$fireModule.firestore.FieldValue;

              const authUser = this.$fire.auth.currentUser;

              const fbUser = await db
                .collection("users")
                .doc(authUser.uid)
                .get()
                .then((documentSnapshot) => {
                  return documentSnapshot.data();
                });
              const user = { ...fbUser, uid: authUser.uid };
              console.log("user", user);
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
                  });
              } catch (e) {
                console.log("add subscription error", e);
              }

              const startDate = this.$dayjs(this.reservationDetails.startDate);
              const endDate = startDate.add(
                this.reservationDetails.numMonths,
                "month"
              );

              const bookDates = {
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                paypalSubscriptionID: data.subscriptionID,
              };
              try {
                db.collection("sites")
                  .doc(this.reservationDetails.site)
                  .update("booked", FieldValue.arrayUnion(bookDates));

                db.collection("sites")
                  .doc(this.reservationDetails.site)
                  .collection("bookings")
                  .doc()
                  .set({
                    paypalSubscriptionID: data.subscriptionID,
                    startDate: this.reservationDetails.startDate,
                    numMonths: this.reservationDetails.numMonths,
                    status: "Initiated",
                    admin: {
                      uid: user.uid,
                      userEmail: user.email,
                      userName: user.name,
                    },
                  });
              } catch (e) {
                console.log("Site/booking add error", e);
              }

              this.paidFor = true;
              this.$emit("success", data);
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