<template>
  <div id="admin">
    <b-tabs pills card :vertical="this.windowWidth > 500 ? true : false">
      <b-tab title="Bookings" active>
        <main>
          <div class="header">
            <h2>Bookings</h2>
            <b-button-group class="ml-2">
              <b-button
                @click="bookingsView = 'calendar'"
                :variant="this.bookingsView == 'calendar' ? 'primary' : 'light'"
              >
                <font-awesome-icon :icon="['fas', 'calendar-alt']" />
              </b-button>
              <b-button
                @click="bookingsView = 'table'"
                :variant="this.bookingsView == 'table' ? 'primary' : 'light'"
              >
                <font-awesome-icon :icon="['fas', 'table']" />
              </b-button>
            </b-button-group>
          </div>
          <div class="calendar-view" v-if="bookingsView == 'calendar'">
            <div class="site-info">
              <!-- <SiteMap admin /> -->
              <b-card>
                <b-card-title>Site Details</b-card-title>
                <b-form-group
                  id="site-select-group"
                  label="Site:"
                  label-for="site-select"
                >
                  <b-form-select
                    id="site-select"
                    v-model="site"
                    @change="clearBookingState"
                  >
                    <b-form-select-option
                      v-for="site in sites"
                      :key="site.id"
                      :value="site.id"
                      >{{ site.id }}</b-form-select-option
                    >
                  </b-form-select>
                  <v-calendar
                    is-expanded
                    :columns="$screens({ default: 1, xl: 2 })"
                    class="mt-3"
                    :attributes="calendarAttributes"
                    @dayclick="onDayClick"
                  />
                </b-form-group>
              </b-card>
              <b-card class="ml-3">
                <h3>Booking Info</h3>
                <BookingInfo
                  :bookingData="bookingData"
                  :site="site"
                  v-if="bookingData.user.name"
                  @cancel="handleModalSubmit"
                  :table="false"
                />
                <div v-else>
                  <p>Select a booking on the calendar to see it's data</p>
                </div>
              </b-card>
            </div>
          </div>
          <div class="table-view" v-else>
            <BookingTable :bookings="bookings" @cancel="handleModalSubmit" />
          </div>
        </main>
      </b-tab>
      <b-tab title="Billing">
        <BillingTable :subscriptions="subscriptions" />
      </b-tab>
      <b-tab title="Manual Entry">
        <!-- TODO: add notes field -->
        <b-card>
          <h3>Manual Entry</h3>
          <b-form id="manual-form" @submit.prevent.stop="onSubmit">
            <b-form-group label="Name" label-for="register-name">
              <b-form-input
                id="form-name"
                type="text"
                :state="validateState('form.name')"
                v-model.trim="$v.form.name.$model"
              ></b-form-input>
              <b-form-invalid-feedback id="form-name-feedback"
                >Name is required</b-form-invalid-feedback
              >
            </b-form-group>

            <b-form-group label="Email" label-for="form-email">
              <b-form-input
                id="form-email"
                type="text"
                v-model.trim="form.email"
              ></b-form-input>
            </b-form-group>
            <b-form-group label-for="start-date-input" label="Start Date">
              <b-form-datepicker
                id="start-date-input"
                v-model.trim="$v.form.startDate.$model"
                :state="validateState('form.startDate')"
                :date-format-options="dateOptions"
                :min="today"
              ></b-form-datepicker>
              <b-form-invalid-feedback v-if="!$v.form.startDate.required"
                >Start date is required</b-form-invalid-feedback
              >
            </b-form-group>
            <b-form-group label-for="end-date-input" label="End Date">
              <b-form-datepicker
                id="end-date-input"
                v-model.trim="$v.form.endDate.$model"
                :state="validateState('form.endDate')"
                :date-format-options="dateOptions"
                :min="today"
              ></b-form-datepicker>
              <b-form-invalid-feedback v-if="!$v.form.endDate.required"
                >End date is required</b-form-invalid-feedback
              >
            </b-form-group>
            <b-form-group label-for="site-select" label="Site">
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
            </b-form-group>
            <b-form-group label-for="notes" label="Notes">
              <b-form-textarea id="notes" v-model="form.notes" rows="3">
              </b-form-textarea>
            </b-form-group>
            <b-button type="submit" variant="primary">Book It</b-button>
          </b-form>
        </b-card>
      </b-tab>
    </b-tabs>
    <b-modal
      :id="`manual-entry-modal`"
      hide-header
      ok-variant="primary"
      cancel-variant="secondary"
    >
      <p>
        {{ modal.message }}
      </p>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SiteMap from "@/components/SiteMap";
import BillingTable from "@/components/BillingTable";
import BookingInfo from "@/components/BookingInfo";
import BookingTable from "@/components/BookingTable";
import { required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  name: "admin",
  data() {
    return {
      windowWidth: window.innerWidth,
      site: 1,
      bookingsView: "calendar",
      sitesAdmin: [],
      subscriptions: [],
      bookings: [],
      validSites: [],
      modal: {
        error: false,
        message: "",
      },
      bookingData: {
        user: {
          name: "",
          email: "",
          paymentStatus: "",
        },
        site: "",
        range: {
          end: "",
          start: "",
        },
      },
      form: {
        site: 1,
        startDate: new Date(),
        endDate: new Date(),
        name: "",
        email: "",
        notes: "",
        error: false,
        submitState: "",
      },
      today: new Date(),
      dateOptions: {
        month: "long",
        day: "numeric",
        year: "numeric",
      },
    };
  },
  mixins: [validationMixin],

  components: {
    SiteMap,
    BillingTable,
    BookingInfo,
    BookingTable,
  },
  validations: {
    form: {
      startDate: {
        required,
      },
      endDate: {
        required,
      },
      site: {
        required,
      },
      name: {
        required,
      },
    },
  },
  computed: {
    ...mapState({
      sites: (state) => state.sites,
    }),
    calendarAttributes() {
      let site = {};
      if (this.sitesAdmin) {
        site = this.sitesAdmin.filter((obj) => {
          return obj?.id == this.site;
        });
      } else {
        return {};
      }
      site = site[0];
      if (!site?.booked) {
        return {};
      }
      const attributes = site.booked.map((booked) => {
        let booking = {};
        console.log(booking);

        if (this.bookings) {
          booking = this.bookings.filter((obj) => {
            return obj?.paypalSubscriptionID == booked.paypalSubscriptionID;
          });
          if (!booking[0]) {
            return {};
          }
        } else {
          return {};
        }
        booking = booking[0];
        console.log(booking);
        return {
          // An optional key can be used for retrieving this attribute later,
          // and will most likely be derived from your data object
          key: booking.paypalSubscriptionID,
          // Attribute type definitions
          highlight: "red", // Boolean, String, Object
          content: "black", // Boolean, String, Object
          popover: {
            label: booking.admin?.userName,
            visibility: "hover",
            hideIndicator: true,
          },
          // Your custom data object for later access, if needed
          customData: {
            user: {
              email: booking.admin?.userEmail,
              name: booking.admin?.userName,
              paymentStatus: booking.status,
              subscriptionID: booking.paypalSubscriptionID,
              notes: booking.admin.notes ? booking.admin.notes : null,
            },
          },
          // We also need some dates to know where to display the attribute
          // We use a single date here, but it could also be an array of dates,
          //  a date range or a complex date pattern.
          dates: [
            {
              start: this.$dayjs(booked.start).toDate(),
              end: this.$dayjs(booked.end).toDate(),
            },
          ],
          // You can optionally provide dates to exclude
          excludeDates: null,
          // Think of `order` like `z-index`
          order: 0,
        };
      });
      return attributes;
    },
  },
  created() {
    // Add local storage to minimize function calls with JSON.stringify and JSON.parse
    this.getSitesAdmin();
    this.getSubscriptions();
    this.getBookings();
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    handleModalSubmit(data) {
      const url = `${this.$config.functionsURL}/webApi/subscription/${data.site}/${data.subscriptionID}/cancel`;
      this.$axios
        .get(url)
        .then(() => {
          this.getSitesAdmin();
          this.getBookings();
          this.clearBookingState();
        })
        .catch((e) => {
          console.error(e);
        });
    },
    dateRangeOverlaps(a_start, a_end, b_start, b_end) {
      if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
      if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
      if (b_start < a_start && a_end < b_end) return true; // a in b
      console.log(a_start, a_end, b_start, b_end);
      return false;
    },
    validateState(name) {
      let objArr = name.split(".");

      const { $dirty, $error } = this.$v[objArr[0]][objArr[1]];
      return $dirty ? !$error : null;
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.form.submitState = "Error";
      } else {
        this.form.submitState = "Submitted";
        const data = {
          ...this.form,
          startDate: this.$dayjs(this.form.startDate).toISOString(),
          endDate: this.$dayjs(this.form.endDate).toISOString(),
        };
        this.$axios
          .post(`${this.$config.functionsURL}/webApi/manual-entry`, {
            data: data,
          })
          .then(() => {
            this.getBookings();
            this.getSitesAdmin();
            this.modal.message = "Booking created!";
            this.$bvModal.show("manual-entry-modal");
            this.clearForm();
          })
          .catch((e) => {
            this.modal.message = "Something went wrong";
            this.$bvModal.show("manual-entry-modal");
          });
      }
    },
    async getSubscriptions() {
      const token = await this.$fire.auth.currentUser.getIdToken(true);
      const response = await this.$axios.get(
        `${this.$config.functionsURL}/webApi/subscriptions`,
        {
          headers: {
            "Authorization": token,
          },
        }
      );
      const subscriptions = response.data;
      this.subscriptions = subscriptions;
    },
    async getSitesAdmin() {
      const token = await this.$fire.auth.currentUser.getIdToken(true);
      const response = await this.$axios.get(
        `${this.$config.functionsURL}/webApi/sites`,
        {
          headers: {
            "Authorization": token,
          },
        }
      );
      this.sitesAdmin = response.data;
    },
    async getBookings() {
      const response = await this.$axios.get(
        `${this.$config.functionsURL}/webApi/bookings`
      );
      this.bookings = response.data;
    },
    onDayClick(e) {
      let startDate = e.attributes[0].dates[0].start;
      let endDate = e.attributes[0].dates[0].end;
      // let options = { year: "numeric", month: "long", day: "numeric" };
      // const dateRange = {
      //   start: new Intl.DateTimeFormat("en-US", options).format(startDate),
      //   end: new Intl.DateTimeFormat("en-US", options).format(endDate),
      // };
      console.log(e.attributes[0]);
      const data = {
        ...e.attributes[0].customData,
        range: {
          start: startDate,
          end: endDate,
        },
      };
      this.bookingData = data;
    },
    clearBookingState() {
      this.bookingData = {
        user: {
          name: "",
          uid: "",
        },
        range: {
          end: "",
          start: "",
        },
      };
    },
    clearForm() {
      this.form = {
        site: 1,
        startDate: new Date(),
        endDate: new Date(),
        name: "",
        email: "",
        notes: "",
        error: false,
        submitState: "",
      };
    },
  },
};
</script>

<style lang="scss">
@media screen and (max-width: 783px) {
  .site-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
    .card {
      margin: 0.5rem 0;
    }
  }
}
@media screen and (min-width: 783px) {
  .site-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
@media screen and (max-width: 719px) {
  table {
    tr {
      margin-bottom: 0.5rem;
    }
  }
}
.header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  svg {
  }
}

#manual-form {
  .form-group {
    margin-bottom: 0;
  }
}
</style>