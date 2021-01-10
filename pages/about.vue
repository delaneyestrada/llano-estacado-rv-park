<template>
  <b-container>
    <h2 class="header mt-5 mb-2">About Us</h2>
    <section id="about">
      <div class="main">
        <gmap-map :center="map.center" :zoom="15">
          <gmap-marker
            :position="map.marker"
            :clickable="true"
            :draggable="true"
          ></gmap-marker>
        </gmap-map>
        <b-card>
          <b-card-text>
            <h3>Lubbock's Premium RV Park</h3>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Quibusdam placeat cum ipsa dolore magnam, dicta saepe omnis in at
              soluta molestiae. Neque molestiae magnam obcaecati labore
              asperiores, quibusdam dicta deleniti? Hic reprehenderit numquam
              quae, ducimus quaerat recusandae libero suscipit modi delectus
              fugit repudiandae quia deserunt? Distinctio saepe in rerum minus
              minima cum aliquam a expedita facere! Repudiandae alias quibusdam
              vitae? Quo numquam mollitia quaerat minus quam, libero porro
              doloremque veniam eum, velit accusantium itaque molestiae culpa
              perspiciatis minima assumenda omnis, ut aperiam. Ad quo sequi
              debitis odio recusandae voluptate nesciunt?
            </p>
          </b-card-text>
        </b-card>
      </div>
    </section>
  </b-container>
</template>

<script>
export default {
  name: "about",
  data() {
    return {
      map: {
        center: { lat: 33.5779, lng: -101.8552 },
        marker: { lat: 33.5779, lng: -101.8552 },
      },
    };
  },
};
</script>

<style lang="scss">
#about {
  .vue-map-container {
    width: 100%;
    height: 20rem;
  }
  .card {
    width: 100%;
  }
}
</style>