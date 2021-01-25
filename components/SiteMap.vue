<template>
  <div id="site-map">
    <b-form inline id="top-form" @submit.prevent.stop="onSubmit">
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

      <b-form-select
        id="site-select"
        v-model="form.site"
        v-if="validSites.length"
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
import resize from "vue-resize-directive";
import { fabric } from "fabric";
import PayPal from "@/components/PayPal";

export default {
  name: "SiteMap",
  mixins: [validationMixin],

  data() {
    return {
      windowWidth: window.innerWidth,
      form: {
        site: "1",
        startDate: new Date(),
        numMonths: 1,
        error: false,
        submitState: "",
      },
      dateOptions: {
        month: "long",
        day: "numeric",
        year: "numeric",
      },
      today: new Date(),
      canvasEl: {
        width: 1000,
        height: 562.5,
        // viewportTransform: [1, 0, 0, 1, 0, 0],
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
  watch: {
    "form.site"(newSite) {
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
  },
  mounted() {
    this.$watch(
      (vm) => [vm.form.numMonths, vm.form.startDate],
      (val) => {
        this.validSites = this.sites.filter((site) => {
          const bookings = site?.booked;
          let formStartDate = this.$dayjs(this.form.startDate);
          const formEndDate = formStartDate
            .add(this.form.numMonths, "month")
            .toDate();
          formStartDate = formStartDate.toDate();
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
      },
      {
        // immediate: true,
        deep: true,
      }
    );
    if (this.admin) {
      console.log("isAdmin");
    }

    fabric.Canvas.prototype.getItemByName = function (name) {
      var object = null,
        objects = this.getObjects();

      for (var i = 0, len = this.size(); i < len; i++) {
        if (objects[i].name && objects[i].name === name) {
          object = objects[i];
          break;
        }
      }

      return object;
    };

    this.addBlockSitesToCanvas(50, 70, 45, 0);
    this.addBlockSitesToCanvas(305, 70, 45, 1);
    this.addBlockSitesToCanvas(50, 490, 45, 2);
    const canvas = this.$refs.canvas.canvas;
    canvas.hoverCursor = "default";
    const office = new fabric.Rect({
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 1,
      height: 80,
      width: 90,
      top: 320,
      left: 740,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
    });
    office.setControlsVisibility({
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
    canvas.add(office);
    const grass = new fabric.Rect({
      fill: "#118965",
      height: 160,
      width: 310,
      top: 420,
      left: 530,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
    });
    grass.setControlsVisibility({
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
    canvas.add(grass);
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
    roadGroup.setControlsVisibility({
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
    canvas.add(roadGroup);

    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    dateRangeOverlaps(a_start, a_end, b_start, b_end) {
      // a_start = a_start.getTime();
      // a_end = a_end.getTime();
      // b_start = b_start.getTime();
      // b_end = b_end.getTime();
      if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
      if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
      if (b_start < a_start && a_end < b_end) return true; // a in b
      console.log(a_start, a_end, b_start, b_end);
      return false;
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
      console.log("width: ", canvas.getWidth());
      const scale = width / canvas.getWidth();
      const zoom = canvas.getZoom() * scale;
      canvas.setDimensions({
        width,
        height,
      });

      canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
      console.log("resize");
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