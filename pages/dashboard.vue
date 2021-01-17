<template>
  <div id="user">
    <b-tabs pills card vertical>
      <b-tab title="Profile" active
        ><b-alert :show="showAlert" dismissable fade variant="primary"
          >Password Reset Email Sent</b-alert
        >
        <main>
          <h2>Profile</h2>
          <b-card no-body>
            <b-tabs pills card>
              <b-tab title="Name" active
                ><b-card-text>{{ name }}</b-card-text></b-tab
              >
              <b-tab title="Email"
                ><b-card-text>{{
                  $fire.auth.currentUser.email
                }}</b-card-text></b-tab
              >
              <b-tab title="Password"
                ><b-card-text
                  ><b-button variant="secondary" @click="resetPassword"
                    >Send Password Reset Email</b-button
                  ></b-card-text
                ></b-tab
              >
            </b-tabs>
          </b-card>
        </main>
      </b-tab>
      <b-tab title="Billing">
        <h2>Billing</h2>
        <small
          >Billing data can take a bit to update. If you don't see your booking
          here yet, wait a few minutes and refresh the page.</small
        >
        <BillingTable :subscriptions="authUser.subscriptions" />
      </b-tab>
      <!-- <b-tab title="Tab 3"><b-card-text>Tab contents 3</b-card-text></b-tab> -->
    </b-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BillingTable from "@/components/BillingTable";

export default {
  name: "dashboard",
  components: {
    BillingTable,
  },
  data() {
    return {
      dismissSeconds: 4,
      showAlert: 0,
      name: "",
    };
  },
  computed: {
    ...mapState({
      authUser: (state) => state.authUser,
    }),
  },
  mounted() {
    const usersCollection = this.$fire.firestore.collection("users");
    usersCollection
      .doc(this.$store.state.authUser.uid)
      .get()
      .then((doc) => {
        this.name = doc.get("name");
      });
  },
  methods: {
    resetPassword() {
      this.$emit("reset-password", this.authUser.email);
      this.showAlert = this.dismissSeconds;
    },
  },
  // methods: {
  //     validateState(name) {
  //     let objArr = name.split('.')
  //     const {
  //       $dirty,
  //       $error
  //     } = this.$v[objArr[0]][objArr[1]];
  //     return $dirty ? !$error : null;
  //   }
  // }
};
</script>

<style lang="scss" scoped>
button {
  margin: 1em;
}
</style>