<template>
  <div>
    <b-container>
      <b-card no-body>
        <b-tabs card pills fill content-class="mt-3">
          <b-tab title="Sign In" active>
            <b-form class="p-3" @submit.stop.prevent="signInUser">
              <b-form-invalid-feedback
                id="sign-in-feedback"
                :state="!signIn.error"
                >Invalid username or password</b-form-invalid-feedback
              >
              <b-form-group label="Email" label-for="sign-in-Email">
                <b-form-input
                  id="sign-in-Email"
                  type="text"
                  data-form="sign-in"
                  required
                  v-model="signIn.email"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Password" label-for="sign-in-password">
                <b-form-input
                  id="sign-in-password"
                  type="password"
                  data-form="sign-in"
                  v-model="signIn.password"
                  required
                ></b-form-input>
              </b-form-group>
              <b-button type="submit" variant="primary"> Sign In </b-button>
              <b-form-text
                class="mt-2"
                tag="a"
                style="cursor: pointer"
                v-b-modal.password-reset-modal
                >Forgot Password</b-form-text
              >
            </b-form>
          </b-tab>
          <b-tab title="Register">
            <b-form class="p-3" @submit.stop.prevent="createUser">
              <b-form-group label="Name" label-for="register-name">
                <b-form-input
                  id="register-name"
                  type="text"
                  :state="validateState('register.name')"
                  data-form="register"
                  v-model.trim="$v.register.name.$model"
                ></b-form-input>
                <b-form-invalid-feedback id="register-name-feedback"
                  >Name is required</b-form-invalid-feedback
                >
              </b-form-group>
              <b-form-invalid-feedback
                id="register-feedback"
                :state="!this.register.error"
                >Email already exists</b-form-invalid-feedback
              >
              <b-form-group label="Email" label-for="register-email">
                <b-form-input
                  id="register-email"
                  type="text"
                  :state="validateState('register.email')"
                  data-form="register"
                  v-model.trim="$v.register.email.$model"
                ></b-form-input>
                <b-form-invalid-feedback v-if="!$v.register.email.email"
                  >Email be a valid email address</b-form-invalid-feedback
                >
                <b-form-invalid-feedback v-if="!$v.register.email.required"
                  >Email is required</b-form-invalid-feedback
                >
              </b-form-group>
              <b-form-group label="Password" label-for="register-password">
                <b-form-input
                  id="register-password"
                  type="password"
                  :state="validateState('register.password')"
                  data-form="register"
                  v-model.trim="$v.register.password.$model"
                ></b-form-input>
                <b-form-invalid-feedback v-if="!$v.register.password.minLength"
                  >Password must be at least 8
                  characters</b-form-invalid-feedback
                >
                <b-form-invalid-feedback v-if="!$v.register.password.required"
                  >Password is required</b-form-invalid-feedback
                >
              </b-form-group>
              <b-form-group
                label="Repeat Password"
                label-for="register-repeat-password"
              >
                <b-form-input
                  id="register-repeat-password"
                  type="password"
                  :state="validateState('register.repeatPassword')"
                  data-form="register"
                  v-model.trim="$v.register.repeatPassword.$model"
                ></b-form-input>
                <b-form-invalid-feedback id="register-repeat-password-feedback"
                  >Does not match password</b-form-invalid-feedback
                >
              </b-form-group>
              <b-button type="submit" variant="primary"> Register </b-button>
            </b-form>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-container>
    <b-modal
      id="password-reset-modal"
      title="Reset Password"
      v-on:ok="resetPassword"
    >
      <b-form-group label="Email">
        <b-form-input v-model="passwordReset.email"> </b-form-input>
        <b-form-text
          >Password reset link will be sent to the email you used to create the
          account</b-form-text
        >
      </b-form-group>
    </b-modal>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, sameAs, email } from "vuelidate/lib/validators";
import { mapState } from "vuex";
import resetPasswordHelper from "../util/password-reset";

export default {
  name: "auth",
  mixins: [validationMixin],
  data() {
    return {
      signIn: {
        email: "",
        password: "",
        error: false,
      },
      register: {
        name: "",
        password: "",
        repeatPassword: "",
        email: "",
        error: false,
      },
      passwordReset: {
        email: "",
        error: false,
      },
      success: false,
    };
  },
  validations: {
    register: {
      name: {
        required,
      },
      password: {
        required,
        minLength: minLength(8),
      },
      repeatPassword: {
        required,
        sameAsPassword: sameAs("password"),
      },
      email: {
        required,
        email,
      },
    },
  },
  computed: {
    ...mapState({
      reservationDetails: (state) => state.reservationDetails,
    }),
  },
  beforeDestroy() {
    if (this.reservationDetails?.redirectPayment && !this.success) {
      this.$store.dispatch("removeReservationNav");
    }
  },
  methods: {
    validateState(name) {
      let objArr = name.split(".");
      const { $dirty, $error } = this.$v[objArr[0]][objArr[1]];
      return $dirty ? !$error : null;
    },
    async createUser() {
      try {
        const { user } = await this.$fire.auth.createUserWithEmailAndPassword(
          this.register.email,
          this.register.password
        );
        const usersCollection = await this.$fire.firestore.collection("users");
        await usersCollection.doc(user.uid).set({
          email: this.register.email,
          name: this.register.name,
        });
        const authUser = {
          email: user.email,
          uid: user.uid,
        };
        await this.$store.dispatch("setAuth", authUser);
        this.redirect(user);
      } catch (e) {
        alert(e);
      }
    },
    async signInUser() {
      try {
        const { user } = await this.$fire.auth.signInWithEmailAndPassword(
          this.signIn.email,
          this.signIn.password
        );
        const authUser = {
          email: user.email,
          uid: user.uid,
        };
        await this.$store.dispatch("setAuth", authUser);
        this.success = true;
        this.redirect(user);
      } catch (e) {
        alert(e);
      }
    },
    async redirect(user) {
      if (this.reservationDetails && this.reservationDetails?.redirectPayment) {
        this.$router.push("/payment");
      } else if (user.email == "llanollano2021@yahoo.com") {
        this.$router.push("/admin");
      } else if (user) {
        this.$router.push("/dashboard");
      }
    },
    async resetPassword() {
      try {
        const response = await resetPasswordHelper(
          this.passwordReset.email,
          this.$fire
        );
        if (response.success) {
          this.showSuccess = true;
        } else {
          this.passwordReset.error = "Error";
        }
      } catch (err) {
        this.passwordReset.error = err.message;
      }
    },
  },
};
</script>

<style lang="scss">
.nav-tabs {
  .nav-link {
    background-color: lighten($secondary, 10%);
    color: $white;
    &.active {
      background-color: darken($primary, 10%);
      color: $white;
    }
  }
}
</style>