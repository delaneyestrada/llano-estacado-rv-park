<template>
  <div>
    <gmap-map :center="map.center" satellite :zoom="12">
      <gmap-info-window
        :options="map.infoOptions"
        :position="map.infoWindowPos"
        :opened="map.infoWinOpen"
        @closeclick="map.infoWinOpen = false"
      >
      </gmap-info-window>
      <gmap-marker
        :position="map.marker.position"
        :clickable="true"
        @click="toggleInfoWindow(map.marker)"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: "GMap",
  data() {
    return {
      map: {
        center: { lat: 33.51529, lng: -101.80763 },
        marker: {
          position: { lat: 33.51529, lng: -101.80763 },
          infoText: `<div class='d-flex flex-column'><h6>Llano Estacado RV Park</h6><a class='btn btn-primary' target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=33.51529,-101.80763">Get Directions</a></div>`,
        },
        infoWindowPos: null,
        infoWinOpen: false,
        infoOptions: {
          content: "",
          pixelOffset: {
            width: 0,
            height: -35,
          },
        },
      },
    };
  },
  methods: {
    toggleInfoWindow: function (marker) {
      this.map.infoWindowPos = marker.position;
      this.map.infoOptions.content = marker.infoText;
      this.map.infoWinOpen = !this.map.infoWinOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
.vue-map-container {
  width: 100%;
  height: 20rem;
}
</style>