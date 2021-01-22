<template>
  <div id="site-map">
    <b-form inline id="top-form">
      <label class="mr-sm-2" for="start-date-input">Start Date: </label>
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

      <label class="mr-sm-2 ml-3" for="num-months-input">Months: </label>
      <b-form-input
        id="num-months-input"
        v-model.trim="$v.form.numMonths.$model"
        :state="validateState('form.numMonths')"
        type="number"
        max="12"
        min="1"
      ></b-form-input>
      <b-form-invalid-feedback v-if="!$v.form.numMonths.required"
        >Number of months is required</b-form-invalid-feedback
      >
      <b-form-invalid-feedback v-if="!$v.form.numMonths.numeric"
        >Number of months must be a number</b-form-invalid-feedback
      >
      <label class="mr-sm-2 ml-3" for="site-select">Site:</label>

      <b-form-select id="site-select" v-model="form.site" v-if="sites">
        <b-form-select-option
          v-for="site in sites"
          :key="site.id"
          :value="site.id"
          >{{ site.id }}</b-form-select-option
        >
      </b-form-select>

      <b-button type="submit" class="ml-auto" variant="primary"
        >Book It</b-button
      >
    </b-form>
    <div id="canvas" ref="container">
      <Konva-stage :config="configKonva" class="stage" ref="stage">
        <Konva-layer v-if="canvas.sites.length">
          <Konva-rect
            v-for="site in canvas.sites"
            :key="site.id"
            :config="{
              x: site.x,
              y: site.y,
              id: site.id,
              draggable: false,
              width: 25,
              height: 50,
              fill: 'grey',
            }"
          >
          </Konva-rect>
        </Konva-layer>
      </Konva-stage>
    </div>
    <!-- <b-card>
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
    </b-card> -->
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
import PayPal from "@/components/PayPal";

export default {
  name: "SiteMap",
  mixins: [validationMixin],

  data() {
    return {
      windowWidth: window.innerWidth,
      configKonva: {
        width: 0,
        height: 0,
        scale: {
          x: 1,
          y: 1,
        },
      },
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
      canvas: {
        sites: [],
      },
    };
  },
  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    PayPal,
  },
  watch: {
    "configKonva.width": function (newWidth, oldWidth) {
      this.canvas.sites = this.canvas.sites.map((site) => {
        return {
          ...site,
          x: newWidth / 2,
          y: newWidth / 2,
        };
      });
    },
  },
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

  mounted() {
    const container = this.$refs.container;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const stage = this.$refs.stage;
    this.configKonva.width = width;
    this.configKonva.height = width * 0.5625;

    if (this.admin) {
      console.log("Admin");
    }
    // this.resizeStage();
    container.addEventListener("resize", this.onCanvasResize);
    window.addEventListener("resize", this.onResize);

    for (let i = 0; i < 1; i++) {
      console.log(this.configKonva);
      this.canvas.sites.push({
        id: i + 1,
        x: this.configKonva.width / 2,
        y: this.configKonva.height / 2,
      });
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    onCanvasResize() {
      console.log("resize");
      this.resizeStage();
    },
    resizeStage() {
      const container = this.$refs.container;
      if (!container) {
        return;
      }
      const width = container.offsetWidth;
      const scale = width / this.configKonva.width;

      this.configKonva.width = this.configKonva.width * scale;
      this.configKonva.height = this.configKonva.height * scale;
      this.configKonva.scale = { x: scale, y: scale };
    },
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

<style lang="scss" scoped>
#canvas {
  background-color: darken(white, 10%);
  height: 0;
  overflow: hidden;
  padding-top: 56.25%;
  position: relative;
}
.stage {
  position: absolute;
  top: 0;
  left: 0;
}
#site-map {
  display: flex;
  flex-direction: column;

  justify-content: center;
  @media screen and (max-width: 992px) {
    .card {
      width: 100%;
    }
  }
  @media screen and (min-width: 992px) {
    .card {
      width: calc(16rem + 1px);
    }
  }

  img {
    width: 100%;
  }
  .card {
    color: $white;
    border-radius: 0;
  }

  #top-form {
    background-color: darken(white, 5%);
    padding: 1em;
  }
}
</style>