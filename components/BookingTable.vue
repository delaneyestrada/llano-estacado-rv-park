<template>
  <div>
    <b-container fluid>
      <!-- User Interface controls -->
      <b-row>
        <b-col lg="6" class="my-1">
          <b-form-group
            label="Sort"
            label-for="sort-by-select"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
            v-slot="{ ariaDescribedby }"
          >
            <b-input-group size="sm">
              <b-form-select
                id="sort-by-select"
                v-model="sortBy"
                :options="sortOptions"
                :aria-describedby="ariaDescribedby"
                class="w-75"
              >
                <template #first>
                  <option value="">-- none --</option>
                </template>
              </b-form-select>

              <b-form-select
                v-model="sortDesc"
                :disabled="!sortBy"
                :aria-describedby="ariaDescribedby"
                size="sm"
                class="w-25"
              >
                <option :value="false">Asc</option>
                <option :value="true">Desc</option>
              </b-form-select>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col lg="6" class="my-1">
          <b-form-group
            label="Filter"
            label-for="filter-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-input-group size="sm">
              <b-form-input
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Type to Search"
              ></b-form-input>

              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''"
                  >Clear</b-button
                >
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col sm="6" md="6" class="my-1">
          <b-form-group
            label="Per page"
            label-for="per-page-select"
            label-cols-sm="6"
            label-cols-md="4"
            label-cols-lg="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-form-select
              id="per-page-select"
              v-model="perPage"
              :options="pageOptions"
              size="sm"
            ></b-form-select>
          </b-form-group>
        </b-col>

        <b-col lg="6" class="my-1">
          <b-form-group
            v-model="sortDirection"
            label="Filter On"
            description="Leave all unchecked to filter on all data"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
            v-slot="{ ariaDescribedby }"
          >
            <b-form-checkbox-group
              v-model="filterOn"
              :aria-describedby="ariaDescribedby"
              class="mt-1"
            >
              <!-- <b-form-checkbox value="admin.userName">Name</b-form-checkbox> -->
              <b-form-checkbox value="site">Site</b-form-checkbox>
              <b-form-checkbox value="startDate">Start Date</b-form-checkbox>
              <b-form-checkbox value="endDate">End Date</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-col>
        <b-col lg="6" class="my-1">
          <b-form-group
            label="Show"
            label-for="sort-by-select"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-form-select
              v-model="showOption"
              :aria-describedby="ariaDescribedby"
              size="sm"
            >
              <option :value="'end'">End Date after today</option>
              <option :value="'all'">All</option>
              <option :value="'start'">Start Date after today</option>
            </b-form-select>
          </b-form-group>
        </b-col>

        <b-col sm="12" md="12" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
      </b-row>

      <!-- Main table element -->
      <b-table
        :items="tableBookings"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filter-included-fields="filterOn"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        stacked="md"
        show-empty
        small
        striped
        @filtered="onFiltered"
      >
        <template #cell(name)="row">
          {{ row.value.first }} {{ row.value.last }}
        </template>

        <template #cell(actions)="row">
          <b-button
            size="sm"
            @click="info(row.item, row.index, $event.target)"
            class="mr-1"
          >
            Info modal
          </b-button>
          <b-button size="sm" @click="row.toggleDetails">
            {{ row.detailsShowing ? "Hide" : "Show" }} Details
          </b-button>
        </template>

        <template #row-details="row">
          <b-card no-body>
            <BookingInfo
              :bookingData="row.item"
              :site="1"
              :table="true"
              @cancel="handleCancel"
            />
          </b-card>
        </template>
      </b-table>

      <!-- Info modal -->
      <b-modal
        :id="infoModal.id"
        :title="infoModal.title"
        ok-only
        @hide="resetInfoModal"
      >
        <pre>{{ infoModal.content }}</pre>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import BookingInfo from "@/components/BookingInfo";
export default {
  name: "BookingsTable",
  data() {
    return {
      fields: [
        {
          key: "site",
          label: "Site",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "admin.userName",
          label: "Name",
          sortable: true,
        },
        {
          key: "startDate",
          label: "Start Date",
          sortable: true,
        },
        {
          key: "endDate",
          label: "End Date",
          sortable: true,
        },
        {
          key: "paypalSubscriptionID",
          label: "ID",
          sortable: true,
        },
        { key: "actions", label: "Actions" },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      showOption: "end",
      pageOptions: [5, 10, 15],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
    };
  },
  props: ["bookings"],
  components: { BookingInfo },
  computed: {
    tableBookings() {
      if (this.bookings) {
        let bookings = this.bookings.filter((booking) => {
          const endDate = this.$dayjs(booking.endDate);
          const startDate = this.$dayjs(booking.startDate);
          const today = this.$dayjs();

          if ((this.showOption = "end")) {
            return (
              today.isBefore(endDate, "day") || today.isSame(endDate, "day")
            );
          } else if ((this.showOption = "start")) {
            return (
              today.isBefore(startDate, "day") || today.isSame(startDate, "day")
            );
          } else {
            return true;
          }
        });
        bookings = bookings.map((booking) => {
          let { endDate, startDate } = booking;
          endDate = this.$dayjs(endDate).format("MM-DD-YYYY");
          startDate = this.$dayjs(startDate).format("MM-DD-YYYY");
          return Object.assign(booking, { endDate, startDate });
        });
        return bookings;
      } else {
        return null;
      }
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.bookings.length;
  },
  methods: {
    handleCancel(data) {
      this.$emit("cancel", data);
    },
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>