<template>
  <b-tabs pills card vertical>
    <b-tab title="Site Map" active>
      <main>
        <h2>Site Map</h2>
        <div class="site-info">
          <SiteMap admin />
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
                class="my-3"
                :attributes="calendarAttributes"
                @dayclick="onDayClick"
              />
            </b-form-group>
            <div v-if="bookingData.user.name">
              <div>
                Booked by: {{ bookingData.user.name }}
                <small>ID: {{ bookingData.user.uid }}</small>
              </div>
              <div>
                From {{ bookingData.range.start }} to
                {{ bookingData.range.end }}
              </div>
            </div>
          </b-card>
        </div>
      </main>
    </b-tab>
    <b-tab title="Billing">
      <BillingTable :subscriptions="subscriptions" />
    </b-tab>
    <!-- <b-tab title="Tab 3"><b-card-text>Tab contents 3</b-card-text></b-tab> -->
  </b-tabs>
</template>

<script>
import { mapState } from "vuex";
import SiteMap from "@/components/SiteMap";
import BillingTable from "@/components/BillingTable";

export default {
  name: "admin",
  data() {
    return {
      site: "1",
      sitesAdmin: [],
      subscriptions: [],
      bookingData: {
        user: {
          name: "",
          uid: "",
        },
        range: {
          end: "",
          start: "",
        },
      },
      // calendarAttributes: [
      //   {
      //     // An optional key can be used for retrieving this attribute later,
      //     // and will most likely be derived from your data object
      //     key: "1",
      //     // Attribute type definitions
      //     highlight: "red", // Boolean, String, Object
      //     content: "black", // Boolean, String, Object
      //     popover: {
      //       label: "Jane Doe",
      //       visibility: "hover",
      //       hideIndicator: true,
      //     },
      //     // Your custom data object for later access, if needed
      //     customData: {
      //       user: {
      //         uid: 1,
      //         name: "Jane Doe",
      //       },
      //     },
      //     // We also need some dates to know where to display the attribute
      //     // We use a single date here, but it could also be an array of dates,
      //     //  a date range or a complex date pattern.
      //     dates: [
      //       {
      //         start: new Date(),
      //         end: new Date(new Date().setMonth(new Date().getMonth() + 8)),
      //       },
      //     ],
      //     // You can optionally provide dates to exclude
      //     excludeDates: null,
      //     // Think of `order` like `z-index`
      //     order: 0,
      //   },
      // ],
    };
  },
  components: {
    SiteMap,
    BillingTable,
  },
  computed: {
    ...mapState({
      sites: (state) => state.sites,
    }),
    calendarAttributes() {
      let site = {};
      if (this.sitesAdmin) {
        site = this.sitesAdmin.filter((obj) => {
          return obj.id == this.site;
        });
        console.log(site[0]);
      } else {
        return {};
      }
      site = site[0];
      if (!site?.booked) {
        console.log("test");
        return {};
      }
      const attributes = site.booked.map((booking) => {
        let subscription = {};

        if (this.subscriptions) {
          subscription = this.subscriptions.filter((obj) => {
            return obj.id == booking.paypalSubscriptionID;
          });
        } else {
          return {};
        }
        subscription = subscription[0];
        return {
          // An optional key can be used for retrieving this attribute later,
          // and will most likely be derived from your data object
          key: subscription.id,
          // Attribute type definitions
          highlight: "red", // Boolean, String, Object
          content: "black", // Boolean, String, Object
          popover: {
            label: subscription.admin?.userName,
            visibility: "hover",
            hideIndicator: true,
          },
          // Your custom data object for later access, if needed
          customData: {
            user: {
              uid: subscription.admin?.uid,
              email: subscription.admin?.userEmail,
              name: subscription.admin?.userName,
              paymentStatus: subscription.status,
            },
          },
          // We also need some dates to know where to display the attribute
          // We use a single date here, but it could also be an array of dates,
          //  a date range or a complex date pattern.
          dates: [
            {
              start: this.$dayjs(booking.start).toDate(),
              end: this.$dayjs(booking.end).toDate(),
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
  },
  methods: {
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
    onDayClick(e) {
      let startDate = e.attributes[0].dates[0].start;
      let endDate = e.attributes[0].dates[0].end;
      let options = { year: "numeric", month: "long", day: "numeric" };
      const dateRange = {
        start: new Intl.DateTimeFormat("en-US", options).format(startDate),
        end: new Intl.DateTimeFormat("en-US", options).format(endDate),
      };
      const data = {
        ...e.attributes[0].customData,
        range: dateRange,
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
  },
};
</script>

<style lang="scss" >
.site-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>