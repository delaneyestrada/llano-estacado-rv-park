<template>
  <div>
    <div class="info-bar">
      <div class="info">Address: 155 Martha Drive, Buda TX</div>
      <div class="info">Phone: (806) 777-1059</div>
      <div class="info">Email: dillon.estrada55@gmail.com</div>
    </div>
    <b-navbar toggleable="lg">
      <b-navbar-brand href="/">Llano Estacado RV Park</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/sites">Sites</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
          <b-nav-item to="/things-to-do">Things To Do</b-nav-item>
          <b-nav-item to="/contact">Contact</b-nav-item>
          <b-nav-item-dropdown right no-caret menu-class="user-dropdown">
            <template #button-content> Register </template>
            <b-nav-form class="p-3" @submit.stop.prevent="registerForm">
              <b-form-invalid-feedback
                id="register-feedback"
                :state="!this.register.error"
                >Username and/or email already exists</b-form-invalid-feedback
              >

              <b-form-group label="Username" label-for="register-username">
                <b-form-input
                  id="register-username"
                  type="text"
                  :state="validateState('register.username')"
                  data-form="register"
                  v-model.trim="$v.register.username.$model"
                ></b-form-input>
                <b-form-invalid-feedback id="register-username-feedback"
                  >Username is required</b-form-invalid-feedback
                >
              </b-form-group>
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
              <b-button type="submit" variant="secondary"> Register </b-button>
            </b-nav-form>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown right no-caret class="user-dropdown sign-in">
            <template #button-content> Sign In </template>
            <b-nav-form class="p-3" @submit.stop.prevent="logIn">
              <b-form-invalid-feedback
                id="sign-in-feedback"
                :state="!this.signIn.error"
                >Invalid username or password</b-form-invalid-feedback
              >
              <b-form-group label="Email" label-for="sign-in-Email">
                <b-form-input
                  id="sign-in-Email"
                  type="text"
                  data-form="sign-in"
                  v-model="signIn.email"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Password" label-for="sign-in-password">
                <b-form-input
                  id="sign-in-password"
                  type="password"
                  data-form="sign-in"
                  v-model="signIn.password"
                ></b-form-input>
              </b-form-group>
              <b-button type="submit" variant="secondary"> Sign In </b-button>
              <b-form-text
                class="ml-3"
                tag="a"
                style="cursor: pointer"
                v-b-modal.password-reset-modal
                >Forgot Password</b-form-text
              >
            </b-nav-form>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <Nuxt />
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
import { mapState, mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
import { required, minLength, sameAs, email } from "vuelidate/lib/validators";
import { auth } from "@/plugins/firebase";

export default {
  name: "App",
  mixins: [validationMixin],

  data() {
    return {
      signIn: {
        email: "",
        password: "",
        error: false,
      },
      register: {
        username: "",
        password: "",
        repeatPassword: "",
        email: "",
        error: false,
      },
      passwordReset: {
        email: "",
        error: false,
      },
    };
  },
  computed: {
    ...mapState({
      authUser: () => state.authUser,
    }),
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
    }),
  },
  mounted() {
    console.log(this.user);
  },
  validations: {
    register: {
      username: {
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
  methods: {
    validateState(name) {
      let objArr = name.split(".");
      const { $dirty, $error } = this.$v[objArr[0]][objArr[1]];
      return $dirty ? !$error : null;
    },
    logIn({ authCreds = null }) {
      if (authCreds) {
        authCreds = null;
      }
      this.$gtag.event("login");
      this.$store.dispatch("login", {
        email: this.signIn.email,
        password: this.signIn.password,
      });
    },
    logOut() {
      this.$store.dispatch("logout");
      if (this.$route.name !== "home") {
        this.$router.push({
          path: "/",
        });
      }
    },
    registerForm() {
      this.$v.register.$touch();
      if (this.$v.register.$anyError) {
        return;
      }
      let registerData = {
        username: this.register.username,
        password: this.register.password,
        email: this.register.email,
      };
      this.$store.dispatch("register", registerData);
    },
    async resetPassword(email = null) {
      try {
        await auth.sendPasswordResetEmail(
          email ? email : this.passwordReset.email
        );
        this.showSuccess = true;
      } catch (err) {
        this.passwordReset.error = err.message;
      }
    },
  },
};
</script>

<style lang="scss">
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

.info-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.info {
  background-color: $primary;
  padding: 0.5em 0;
  text-align: center;
  border-right: 2px solid rgba($white, 0.5);
  font-size: 0.8rem;
}

.form-group {
  padding-bottom: 1rem;
  width: 100%;
}
</style>
