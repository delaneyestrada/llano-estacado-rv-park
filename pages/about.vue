<template>
  <b-container>
    <h2 class="header mt-5 mb-2">About Us</h2>
    <section id="about">
      <div class="main">
        <GMap />
        <b-card>
          <h3>Lubbock's Premium RV Park</h3>
          <span>
            Located conveniently near highways 84, 87, and the loop 289. We
            offer everything you need for a comfortable short or long-term stay.
          </span>
          <h4 class="my-3">Amenities</h4>
          <div class="amenities-list">
            <div class="amenity-item">
              <font-awesome-icon class="icon" :icon="['fas', 'user-friends']" />
              <span>Enclosed Community Center</span>
            </div>
            <div class="amenity-item">
              <font-awesome-icon class="icon" :icon="['fas', 'coins']" />
              <span>Onsite Vending Machine</span>
            </div>
            <div class="amenity-item">
              <font-awesome-icon class="icon" :icon="['fas', 'tint']" />
              <span>Laundry Center</span>
            </div>
            <div class="amenity-item">
              <font-awesome-icon class="icon" :icon="['fas', 'utensils']" />
              <span>Picnic Center</span>
            </div>
            <div class="amenity-item">
              <font-awesome-icon class="icon" :icon="['fas', 'bolt']" />
              <span>20, 30, and 50 amp connections</span>
            </div>
            <div class="amenity-item">
              <font-awesome-icon
                class="icon"
                :icon="['fas', 'money-bill-wave']"
              />
              <span>All Utilities Paid</span>
            </div>
            <div class="amenity-item">
              <font-awesome-icon
                class="icon"
                :icon="['fas', 'expand-arrows-alt']"
              />
              <span>Oversized Lots</span>
            </div>
            <div class="amenity-item">
              <font-awesome-icon class="icon" :icon="['fas', 'caravan']" />
              <span>Pull-through spaces</span>
            </div>
          </div>
        </b-card>
      </div>
    </section>
  </b-container>
</template>

<script>
import GMap from "@/components/GMap";

export default {
  name: "about",
  components: {
    GMap,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss">
#about {
  .card {
    width: 100%;
    border-radius: 0;
  }
}

.amenities-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  .amenity-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 1em;
    .icon {
      font-size: 2em;
      margin: 0.5em auto;
    }
    span {
      text-align: center;
    }
  }
}
</style>