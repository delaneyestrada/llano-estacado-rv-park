<template>
  <div id="site-map">
    <b-form inline id="top-form" @submit.prevent.stop="onSubmit">
      <label class="mr-sm-2 ml-3" for="booking-select">Interval: </label>
      <b-form-select
        id="booking-select"
        v-model="form.bookingType"
        @change="setReservationDetails"
      >
        <b-form-select-option value="monthly">Monthly</b-form-select-option>
        <b-form-select-option value="weekly">Weekly</b-form-select-option>
      </b-form-select>
      <label class="mr-sm-2 ml-3" for="start-date-input">Start Date: </label>
      <b-form-datepicker
        id="start-date-input"
        v-model.trim="$v.form.startDate.$model"
        :state="validateState('form.startDate')"
        :date-format-options="dateOptions"
        :min="tomorrow"
        :max="oneYearFromNow"
        @input="setReservationDetails"
      ></b-form-datepicker>
      <b-form-invalid-feedback v-if="!$v.form.startDate.required"
        >Start date is required</b-form-invalid-feedback
      >
      <div id="num-months" class="d-flex" v-if="form.bookingType == 'monthly'">
        <label class="mr-sm-2 ml-3" for="num-months-input">Months: </label>
        <b-form-input
          id="num-months-input"
          v-model.trim="$v.form.numMonths.$model"
          :state="validateState('form.numMonths')"
          type="number"
          max="12"
          min="1"
          @change="setReservationDetails"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.numMonths.required"
          >Number of months is required</b-form-invalid-feedback
        >
        <b-form-invalid-feedback v-if="!$v.form.numMonths.numeric"
          >Number of months must be a number</b-form-invalid-feedback
        >
      </div>
      <div id="num-weeks" class="d-flex" v-else>
        <label class="mr-sm-2 ml-3" for="num-weeks-input">Weeks: </label>
        <b-form-input
          id="num-weeks-input"
          v-model.trim="$v.form.numWeeks.$model"
          :state="validateState('form.numWeeks')"
          type="number"
          max="52"
          min="1"
          @change="setReservationDetails"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.numWeeks.required"
          >Number of weeks is required</b-form-invalid-feedback
        >
        <b-form-invalid-feedback v-if="!$v.form.numWeeks.numeric"
          >Number of weeks must be a number</b-form-invalid-feedback
        >
      </div>

      <label class="mr-sm-2 ml-3" for="site-select">Site:</label>

      <b-form-select
        id="site-select"
        v-model="form.site"
        v-if="validSites.length"
        @change="setReservationDetails"
      >
        <b-form-select-option
          v-for="site in validSites"
          :key="site.id"
          :value="site.id"
          >{{ site.id }}</b-form-select-option
        >
      </b-form-select>
      <b-form-select id="site-select" v-model="form.site" v-else>
        <b-form-select-option
          v-for="site in sites"
          :key="site.id"
          :value="site.id"
          @change="setReservationDetails"
          >{{ site.id }}</b-form-select-option
        >
      </b-form-select>

      <b-button type="submit" class="ml-auto" variant="primary"
        >Book It</b-button
      >
    </b-form>
    <div
      id="canvas"
      ref="container"
      v-resize="onContainerResize"
      @select-object="handleCanvasClick"
      class="mb-5"
    >
      <fabric-canvas
        id="fabric-container"
        class="fabric-container"
        ref="canvas"
        v-bind="canvasEl"
      >
      </fabric-canvas>
    </div>
    <!-- <b-modal id="payment-modal" hide-footer title="Reservation Details">
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
    </b-modal> -->
    <b-modal
      id="error-modal"
      hide-header
      ok-only
      ok-variant="primary"
      ok-title="Reload Page"
      v-on:ok="reloadPage"
    >
      <p>This site is no longer available for the time frame selected.</p>
    </b-modal>
  </div>
</template>

<script>
import { required, numeric } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapState, mapGetters } from "vuex";
import resize from "vue-resize-directive";
import { fabric } from "fabric";
import PayPal from "@/components/PayPal";

export default {
  name: "SiteMap",
  mixins: [validationMixin],

  data() {
    return {
      windowWidth: window.innerWidth,
      unwatch: "",
      checkingSites: false,
      form: {
        site: 1,
        bookingType: "monthly",
        startDate: this.$dayjs().add(1, "day").toDate(),
        numMonths: 1,
        numWeeks: 1,
        error: false,
        submitState: "",
      },
      dateOptions: {
        month: "long",
        day: "numeric",
        year: "numeric",
      },
      today: new Date(),
      tomorrow: this.$dayjs().add(1, "day").toDate(),
      canvasEl: {
        width: 1000,
        height: 562.5,
      },
      validSites: [],
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
  directives: {
    resize,
  },
  components: {
    PayPal,
  },
  computed: {
    ...mapState({
      sites: (state) => state.sites,
      reservationDetails: (state) => state.reservationDetails,
    }),
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
    }),
    oneYearFromNow() {
      return new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    },
    bookingDetails() {
      if (this.reservationDetails) {
        const startDate = this.$dayjs(this.reservationDetails.startDate);
        if (this.reservationDetails.bookingType == "monthly") {
          let startNextMonth = null;
          let numDaysUntilNextMonth = null;
          const daysInMonth = startDate.daysInMonth();
          let immediate = false;

          if (startDate.date() == 1) {
            startNextMonth = startDate;
            numDaysUntilNextMonth = 0;
            immediate = true;
          } else {
            startNextMonth = startDate.add(1, "month").date(1);
            numDaysUntilNextMonth = startNextMonth.diff(startDate, "day");
          }
          const proratedCharge = (
            (numDaysUntilNextMonth / daysInMonth) *
            this.$config.monthlyRate
          ).toFixed(2);
          const numIntervals = this.reservationDetails.numMonths - 1;
          const endDate = startNextMonth
            .add(numIntervals, "month")
            .subtract(1, "day");
          const paymentStart = startDate.add(1, "month");
          return {
            interval: "monthly",
            nextIntervalStart: startNextMonth,
            numDaysNextInterval: numDaysUntilNextMonth,
            daysInMonth,
            proratedCharge,
            numIntervals,
            startDate,
            paymentStart,
            immediate,
            endDate,
          };
        } else if (this.reservationDetails.bookingType == "weekly") {
          const numIntervals = this.reservationDetails.numWeeks - 1;
          let startNextWeek = null;
          let numDaysUntilNextWeek = null;
          let immediate = true;
          // if (startDate.day() == 0) {
          //   startNextWeek = startDate.add(1, "day");
          //   numDaysUntilNextWeek = 1;
          // } else
          if (startDate.day()) {
            startNextWeek = startDate;
            numDaysUntilNextWeek = 0;
            immediate = true;
          } else {
            startNextWeek = startDate.add(1, "week").day(1);
            numDaysUntilNextWeek = startNextWeek.diff(startDate, "day");
          }
          const endDate = startNextWeek
            .add(numIntervals, "week")
            .subtract(1, "day");
          const proratedCharge = (
            (numDaysUntilNextWeek / 7) *
            this.$config.weeklyRate
          ).toFixed(2);

          const paymentStart = startDate.add(1, "week");

          return {
            interval: "weekly",
            nextIntervalStart: startNextWeek,
            numDaysNextInterval: numDaysUntilNextWeek,
            proratedCharge,
            numIntervals,
            startDate,
            paymentStart,
            immediate,
            endDate,
          };
        } else {
          return null;
        }
      }
    },
  },
  validations: {
    form: {
      startDate: {
        required,
      },
      numMonths: {
        numeric,
      },
      numWeeks: {
        numeric,
      },
    },
  },
  watch: {
    "form.site"(newSite) {
      this.renderSelected(newSite);
    },
  },
  mounted() {
    this.$store.dispatch("setReservationDetails", { ...this.form });
    this.unwatch = this.$watch(
      (vm) => [
        vm.form.bookingType,
        vm.form.numMonths,
        vm.form.startDate,
        vm.sites,
        vm.form.numWeeks,
      ],
      (val) => {
        this.watchFunction();
      },
      {
        immediate: false,
        deep: true,
      }
    );
    function noControls(objects) {
      objects.forEach((object) => {
        object.setControlsVisibility({
          bl: false,
          br: false,
          mb: false,
          ml: false,
          mr: false,
          mt: false,
          tl: false,
          tr: false,
          mtr: false,
        });
      });
    }

    this.addBlockSitesToCanvas(50, 70, 45, 0);
    this.addBlockSitesToCanvas(305, 70, 45, 1);
    this.addBlockSitesToCanvas(50, 490, 45, 2);
    const canvas = this.$refs.canvas.canvas;
    canvas.hoverCursor = "default";
    const officeHeight = 80;
    const officeWidth = 90;
    const officeText = new fabric.Text("Office", {
      fontSize: 22,
      top: officeHeight / 2 - 12,
      left: officeWidth / 2 - 26,
      originX: "left",
      originY: "top",
    });
    const office = new fabric.Rect({
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 1,
      height: officeHeight,
      width: officeWidth,
    });
    let officeGroup = new fabric.Group([office, officeText], {
      top: 320,
      left: 740,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      hoverCursor: "default",
      clickable: false,
    });
    const grass = new fabric.Rect({
      fill: "#11dd65",
      height: 160,
      width: 310,
      top: 420,
      left: 530,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
    });

    const road = new fabric.Rect({
      fill: "#000000",
      height: 1000,
      width: 70,
    });
    var lines = [];
    for (let i = 0; i < 20; i++) {
      lines = [
        ...lines,
        new fabric.Rect({
          fill: "#e9e444",
          height: 12,
          width: 4,
          top: (i + 1) * 30,
          left: 35,
          originX: "left",
          originY: "top",
        }),
      ];
    }
    let roadGroup = new fabric.Group([road, ...lines], {
      top: 0,
      left: 890,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
    });
    noControls([roadGroup, officeGroup, grass]);
    canvas.add(roadGroup, officeGroup, grass);
    if (this.sites?.length) {
      this.watchFunction();
    }
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    this.unwatch();
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    dateRangeOverlaps(a_start, a_end, b_start, b_end) {
      if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
      if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
      if (b_start < a_start && a_end < b_end) return true; // a in b
      console.log(a_start, a_end, b_start, b_end);
      return false;
    },
    renderSelected(newSite) {
      const canvasSites = this.getCanvasSites();
      const canvas = this.$refs.canvas.canvas;
      canvasSites.valid.forEach((site) => {
        const rect = site.getObjects("rect")[0];

        if (site.name == newSite) {
          rect.set("fill", "#ffff00");
        } else {
          rect.set("fill", "#00ff00");
        }
      });
      canvas.renderAll();
    },
    getCanvasSites() {
      const canvas = this.$refs.canvas.canvas;
      const objects = canvas.getObjects("group");
      const sites = objects.filter((object) => {
        return object?.name;
      });
      if (!sites.length) {
        sites = this.getCanvasSites();
      }
      const valid = sites.filter((canvasSite) => {
        return this.validSites.some((site) => site.id == canvasSite.name);
      });
      const invalid = sites.filter((canvasSite) => {
        return !this.validSites.some((site) => site.id == canvasSite.name);
      });
      return { valid, invalid };
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    addBlockSitesToCanvas(top, left, gap, group) {
      console.log("sites added");

      this.addSitesToCanvas(top, left, gap, group, "top");
      this.addSitesToCanvas(top + 110, left, gap, group, "bottom");
    },
    addSitesToCanvas(top, left, gap, group, position) {
      const canvas = this.$refs.canvas.canvas;
      let id = group * 14;
      if (position == "bottom") {
        id += 7;
      }

      for (let i = 0; i < 7; i++) {
        const height = 90;
        const width = 34;
        const text = new fabric.Text((id + i + 1).toString(), {
          fontSize: 22,
          top: height / 2 - 10,
          left: id + i + 2 <= 10 ? width / 2 - 5 : width / 2 - 11,
          originX: "left",
          originY: "top",
        });
        const obj = new fabric.Rect({
          fill: "#e6e6e6",
          stroke: "#000000",
          strokeWidth: 1,
          height: height,
          width: width,
        });
        let group = new fabric.Group([obj, text], {
          top: top,
          left: (i + 1) * gap + left,
          name: (id + i + 1).toString(),
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          hoverCursor: "default",
          clickable: false,
        });
        group.setControlsVisibility({
          bl: false,
          br: false,
          mb: false,
          ml: false,
          mr: false,
          mt: false,
          tl: false,
          tr: false,
          mtr: false,
        });
        group.on("mousedown", (e) => {
          if (e.target.clickable) {
            const event = new CustomEvent("select-object", {
              detail: e.target,
            });
            document.getElementById("canvas").dispatchEvent(event);
          }
        });
        canvas.add(group);
      }
    },
    onContainerResize() {
      this.resizeCanvas();
    },
    resizeCanvas() {
      const container = this.$refs.container;
      const canvas = this.$refs.canvas.canvas;
      if (!container) {
        return;
      }

      const width = container.clientWidth;
      const height = container.clientHeight;
      const scale = width / canvas.getWidth();
      const zoom = canvas.getZoom() * scale;
      canvas.setDimensions({
        width,
        height,
      });

      canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
      canvas.renderAll();
    },
    handleCanvasClick(e) {
      this.form.site = e.detail.name;
    },
    validateState(name) {
      let objArr = name.split(".");

      const { $dirty, $error } = this.$v[objArr[0]][objArr[1]];
      return $dirty ? !$error : null;
    },
    async watchFunction() {
      console.log("watch function");
      if (!this.checkingSites && this.bookingDetails) {
        this.validSites = await this.checkOverlapping(this.sites);
        this.renderSites();
      }
    },
    async checkOverlapping(sites) {
      await this.$store.dispatch("setReservationDetails", { ...this.form });
      const validSites = sites.filter((site) => {
        const bookings = site?.booked;
        let formStartDate = this.$dayjs(this.form.startDate);
        let formEndDate = null;

        const { nextIntervalStart, interval } = this.bookingDetails;

        if (interval == "monthly") {
          formEndDate = nextIntervalStart
            .add(this.form.numMonths, "month")
            .toDate();
        } else if (interval == "weekly") {
          formEndDate = nextIntervalStart
            .add(this.form.numWeeks, "week")
            .toDate();
        }

        formStartDate = formStartDate.toDate();
        console.log(formStartDate, formEndDate);
        let overlappingBookings = [];
        if (bookings) {
          overlappingBookings = bookings.filter((booking) => {
            const bookingStartDate = this.$dayjs(booking.start).toDate();
            const bookingEndDate = this.$dayjs(booking.end).toDate();
            const overlap = this.dateRangeOverlaps(
              formStartDate,
              formEndDate,
              bookingStartDate,
              bookingEndDate
            );
            console.log(bookingStartDate, bookingEndDate, overlap);
            if (overlap) {
              return true;
            }
          });

          if (!overlappingBookings.length) {
            return site;
          }
        }
      });
      return validSites;
    },
    renderSites() {
      if (this.sites.length && this.validSites) {
        const lowestNumberSite = this.validSites.reduce(function (prev, curr) {
          return prev.id < curr.id ? prev : curr;
        }).id;
        this.form.site = lowestNumberSite;
        const canvasSites = this.getCanvasSites();
        const canvas = this.$refs.canvas.canvas;
        canvasSites.valid.forEach((site) => {
          const rect = site.getObjects("rect")[0];
          rect.set("fill", "#00ff00");
          rect.group.hoverCursor = "pointer";
          rect.group.clickable = true;
          canvas.renderAll();
        });
        canvasSites.invalid.forEach((site) => {
          const rect = site.getObjects("rect")[0];
          rect.set("fill", "#efefef");
          rect.group.hoverCursor = "default";
          rect.group.clickable = false;
          canvas.renderAll();
        });
        this.renderSelected(lowestNumberSite);
      } else {
        console.log("no sites");
      }
    },
    reloadPage() {
      location.reload();
    },
    onSubmit() {
      this.$v.$touch();
      this.checkingSites = true;
      if (this.$v.$invalid) {
        this.form.submitState = "Error";
      } else {
        this.form.submitState = "Submitted";
        try {
          this.$store.dispatch("getSites").then(async () => {
            const validSites = await this.checkOverlapping(this.sites);
            console.log(validSites);
            if (
              !validSites.some((validSite) => validSite.id == this.form.site)
            ) {
              this.$bvModal.show("error-modal");
            } else {
              this.$store.dispatch("setBookingDetails", this.bookingDetails);
              if (!this.isLoggedIn) {
                const reservationDetails = {
                  ...this.form,
                  redirectPayment: true,
                };
                this.$store.dispatch(
                  "setReservationDetails",
                  reservationDetails
                );
                this.$router.push("/login");
              } else {
                const reservationDetails = { ...this.form };
                this.$store.dispatch(
                  "setReservationDetails",
                  reservationDetails
                );
                this.$router.push("/payment");
              }
            }
          });
        } catch (e) {
          console.log(e);
          this.checkingSites = false;
        }
      }
    },
    setReservationDetails() {
      this.$store.dispatch("setReservationDetails", { ...this.form });
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
.fabric-container {
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