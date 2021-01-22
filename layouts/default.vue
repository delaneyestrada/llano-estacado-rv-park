<template>
  <div>
    <Nuxt v-if="publish" />
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
      publish: false,
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
  mounted() {
    if (this.isLoggedIn) {
      console.log(`Current User Email: ${this.$fire.auth.currentUser.email}`);
    } else {
      console.log("Not Logged In");
    }
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
        if (this.$route.path == "/admin" || this.$route.path == "/dashboard") {
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
