<template>
  <div>
    <b-container>
      <h2 class="header mt-5 mb-2">Book Your Site</h2>
      <section id="site-picker">
        <SiteMap />
        <b-card>
          <b-form @submit.stop.prevent="onSubmit">
            <small class="d-block mb-3"
              >Bookings are prorated to the first of the next month and then are
              charged from month to month</small
            >
            <b-form-group
              id="site-select-group"
              label="Site:"
              label-for="site-select"
            >
              <b-form-select id="site-select" v-model="form.site" v-if="sites">
                <b-form-select-option
                  v-for="site in sites"
                  :key="site.id"
                  :value="site.id"
                  >{{ site.id }}</b-form-select-option
                >
              </b-form-select>
            </b-form-group>

            <b-form-group
              id="start-date-group"
              label="Start Date:"
              label-for="start-date-input"
            >
              <b-form-datepicker
                id="start-date-input"
                v-model.trim="$v.form.startDate.$model"
                :state="validateState('form.startDate')"
                :date-format-options="dateOptions"
                :min="today"
                :max="oneYearFromNow"
              ></b-form-datepicker>
              <b-form-invalid-feedback v-if="!$v.form.startDate.required"
                >Start date is required</b-form-invalid-feedback
              >
            </b-form-group>
            <b-form-group
              id="num-months-group"
              label="Number of months:"
              label-for="num-months-input"
            >
              <b-form-input
                id="num-months-input"
                v-model.trim="$v.form.numMonths.$model"
                :state="validateState('form.numMonths')"
              ></b-form-input>
              <b-form-invalid-feedback v-if="!$v.form.numMonths.required"
                >Number of months is required</b-form-invalid-feedback
              >
              <b-form-invalid-feedback v-if="!$v.form.numMonths.numeric"
                >Number of months must be a number</b-form-invalid-feedback
              >
            </b-form-group>

            <b-button type="submit" variant="primary">Submit</b-button>
          </b-form>
        </b-card>
      </section>
    </b-container>
    <b-modal id="payment-modal" hide-footer title="Reservation Details">
      <p class="my-4">
        You are about to rent site {{ form.site }} starting on
        {{ form.startDate }} for {{ form.numMonths }} months.
      </p>
      <p class="my-4">Select a payment method below.</p>
      <PayPal
        :submitState="form.submitState"
        :numMonths="form.numMonths"
        @success="onSubscribeSuccess"
      />
    </b-modal>
  </div>
</template>

<script>
import { required, numeric } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapState, mapGetters } from "vuex";
import SiteMap from "@/components/SiteMap";
import PayPal from "@/components/PayPal";

export default {
  name: "Sites",
  mixins: [validationMixin],

  data() {
    return {
      form: {
        site: "1",
        startDate: "",
        numMonths: "",
        error: false,
        submitState: "",
      },
      dateOptions: {
        month: "long",
        day: "numeric",
        year: "numeric",
      },
      today: new Date(),
    };
  },
  components: {
    SiteMap,
    PayPal,
  },
  created() {},
  computed: {
    ...mapState({
      sites: (state) => state.sites,
    }),
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
    }),
    oneYearFromNow() {
      return new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    },
  },
  validations: {
    form: {
      startDate: {
        required,
      },
      numMonths: {
        required,
        numeric,
      },
    },
  },
  methods: {
    validateState(name) {
      let objArr = name.split(".");

      const { $dirty, $error } = this.$v[objArr[0]][objArr[1]];
      return $dirty ? !$error : null;
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.form.submitState = "Error";
      } else {
        this.form.submitState = "Submitted";

        if (!this.isLoggedIn) {
          const reservationDetails = { ...this.form, redirectPayment: true };
          this.$store.dispatch("setReservationDetails", reservationDetails);
          this.$router.push("/login");
        } else {
          const reservationDetails = { ...this.form };
          this.$store.dispatch("setReservationDetails", reservationDetails);
          this.$router.push("/payment");
        }
      }
    },
    onSubscribeSuccess() {
      alert("success");
    },
  },
};
</script>

<style lang="scss">
#site-picker {
  display: grid;
  grid-template-columns: 2fr 1fr;
  img {
    width: 100%;
  }
  .card {
    color: $white;
    border-radius: 0;
  }
}
</style>