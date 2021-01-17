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
        this.loaded = true;
        window.paypal
          .Buttons({
            createSubscription: (data, actions) => {
              console.log(this.reservationDetails.numMonths.toString());
              return actions.subscription.create({
                "plan_id": "P-5CM02520BF7560243L77KBHY",
                "custom_id": this.reservationDetails.site,
                "plan": {
                  "billing_cycles": [
                    {
                      "pricing_scheme": {
                        "version": 1,
                        "fixed_price": {
                          "currency_code": "USD",
                          "value": "2.00",
                        },
                      },
                      "sequence": 1,
                      "total_cycles": this.reservationDetails.numMonths.toString(),
                    },
                  ],
                },
              });
            },
            onApprove: async (data, actions) => {
              // const order = await actions.order.capture();
              console.log(data);
              const user = this.$fire.auth.currentUser;
              this.$fire.firestore
                .collection("users")
                .doc(user.uid)
                .collection("subscriptions")
                .doc()
                .set({
                  id: data.subscriptionID,
                  status: null,
                });
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