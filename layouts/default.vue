<template>
  <div>
    <div class="info-bar">
      <div class="info">
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=33.51529,-101.80763"
          target="_blank"
        >
          <div class="icon">
            <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
          </div>
        </a>
        <span class="hide-small">2315 E CR 7130 Lubbock, TX 79404</span>
      </div>
      <div class="info">
        <div class="icon">
          <font-awesome-icon :icon="['fas', 'phone-square']" />
        </div>
        <span>(806) 777-1059</span>
      </div>
      <div class="info">
        <nuxt-link to="/contact">
          <div class="icon">
            <font-awesome-icon :icon="['fas', 'envelope']" />
          </div>
        </nuxt-link>
        <span class="hide-small">dillon.estrada55@gmail.com</span>
      </div>
    </div>
    <client-only>
      <b-navbar toggleable="lg">
        <b-navbar-brand href="/">Llano Estacado RV Park</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/" :active="$route.path == '/'">Home</b-nav-item>
            <b-nav-item to="/sites" :active="$route.path == '/sites'"
              >Sites</b-nav-item
            >
            <b-nav-item to="/about" :active="$route.path == '/about'"
              >About</b-nav-item
            >
            <b-nav-item
              to="/things-to-do"
              :active="$route.path == '/things-to-do'"
              >Things To Do</b-nav-item
            >
            <b-nav-item to="/contact" :active="$route.path == '/contact'"
              >Contact</b-nav-item
            >
            <b-nav-item
              to="/login"
              v-if="!isLoggedIn"
              :active="$route.path == '/login'"
              >Sign In/Register</b-nav-item
            >
            <b-nav-item-dropdown
              v-if="isLoggedIn"
              right
              no-caret
              class="user-dropdown"
              menu-class="user-dropdown"
            >
              <template #button-content>User</template>
              <b-dropdown-item :to="`/dashboard`">Dashboard</b-dropdown-item>
              <b-dropdown-item v-if="authUser.isAdmin" :to="`/admin`"
                >Admin</b-dropdown-item
              >
              <b-dropdown-item v-on:click="logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
            <!-- <b-nav-item-dropdown
              v-if="!isLoggedIn"
              right
              no-caret
              menu-class="user-dropdown"
            >
              <template #button-content> Register </template>
              <b-nav-form class="p-3" @submit.stop.prevent="createUser">
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
                  <b-form-invalid-feedback
                    v-if="!$v.register.password.minLength"
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
                  <b-form-invalid-feedback
                    id="register-repeat-password-feedback"
                    >Does not match password</b-form-invalid-feedback
                  >
                </b-form-group>
                <b-button type="submit" variant="secondary">
                  Register
                </b-button>
              </b-nav-form>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown
              v-if="!isLoggedIn"
              right
              no-caret
              class="user-dropdown sign-in"
            >
              <template #button-content> Sign In </template>
              <b-nav-form class="p-3" @submit.stop.prevent="signInUser">
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
            </b-nav-item-dropdown> -->
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </client-only>
    <Nuxt />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
import { required, minLength, sameAs, email } from "vuelidate/lib/validators";

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
    };
  },
  computed: {
    ...mapState({
      authUser: (state) => state.authUser,
    }),
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
    }),
  },
  created() {
    this.$store.dispatch("getSites");
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
          sites: [],
        });
      } catch (e) {
        alert(e);
      }
    },
    async signInUser() {
      try {
        await this.$fire.auth.signInWithEmailAndPassword(
          this.signIn.email,
          this.signIn.password
        );
      } catch (e) {
        alert(e);
      }
    },
    async logout() {
      try {
        await this.$fire.auth.signOut();
        if (
          this.$route.path == "/admin" ||
          this.$route.path == "/dashboard" ||
          this.$route.path == "/payment"
        ) {
          this.$router.push("/");
        }
      } catch (e) {
        alert(e);
      }
    },
    async resetPassword(email = null) {
      try {
        await this.$fire.auth.sendPasswordResetEmail(
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
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
body {
  font-family: $montserrat;
}

.info-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.info {
  background-color: $primary;
  padding: 0.5em 1em;
  text-align: center;
  border-right: 2px solid rgba($white, 0.5);
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  .icon {
    margin-right: 0.5em;
    font-size: 0.9rem;
    color: $white;
  }
}
.card {
  color: $white;
}
@media screen and (max-width: 625px) {
  .hide-small {
    display: none;
  }
}
a {
  color: $white;
  &:hover {
    color: $white;
  }
}

.form-group {
  padding-bottom: 1rem;
  width: 100%;
}
</style>
