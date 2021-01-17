<template>
  <div>
    <b-table
      :items="subscriptionsCopy"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      table-variant="secondary"
      stacked="md"
      show-empty
      small
    >
      <template #cell(actions)="row" v-if="authUser.isAdmin">
        <b-button size="sm" :href="filterLinks(row.item.links, 'self').href">
          More Details
        </b-button>
      </template>

      <!-- <template #row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">
              {{ key }}: {{ value }}
            </li>
          </ul>
        </b-card>
      </template> -->
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      align="fill"
      size="sm"
      class="my-0 ml-auto"
      hide-ellipsis
      hide-goto-end-buttons
    ></b-pagination>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "billing-table",
  data() {
    return {
      fields: [
        { key: "site", label: "Site", sortable: true },
        { key: "created", label: "Date Booked", sortable: true },
        { key: "status", label: "Status", sortable: true },
      ],
      currentPage: 1,
      perPage: 5,
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
    };
  },
  computed: {
    ...mapState({
      authUser: (state) => state.authUser,
    }),
    subscriptionsCopy() {
      if (this.subscriptions) {
        const subscriptions = JSON.parse(JSON.stringify(this.subscriptions));
        return subscriptions;
      } else {
        return null;
      }
    },
    totalRows() {
      if (this.subscriptions) {
        return this.subscriptions.length;
      } else {
        return 0;
      }
    },
  },
  props: {
    subscriptions: {
      default: [],
    },
  },
  created() {
    if (this.authUser.isAdmin) {
      this.fields = [...this.fields, { key: "actions", label: "Actions" }];
    }
  },
  methods: {
    filterLinks(links, rel) {
      const filtered = links.filter((link) => {
        return link.rel == rel;
      });
      return filtered[0];
    },
  },
};
</script>

<style lang="scss" scoped>
// table {
//   color: $white;
// }
.pagination {
  max-width: 100%;
  width: 10rem;
}
</style>