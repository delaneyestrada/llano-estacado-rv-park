<template>
  <div id="home">
    <div class="header">
      <div class="main">
        <h1>Llano Estacado RV Park</h1>
        <h2>Coming soon!</h2>
        <!-- <b-button variant="primary">Book A Site</b-button> -->
      </div>
      <img src="@/static/rv-driving-llano.jpg" alt="" />
    </div>
    <main>
      <b-card no-body>
        <GMap :noInfoWindow="true" />
        <div class="card-content p-3 my-auto">
          <ul>
            <li>
              Conveniently located near US-84 and US-87 as well as Loop 289
            </li>
            <li>Oversized RV spots to make sure your rig fits</li>
            <li>Locally owned & operated</li>
            <li>Easy booking online, by phone, or in person</li>
          </ul>
        </div>
      </b-card>
      <!-- <b-card no-body>
        <b-carousel
          id="carousel-1"
          controls
          background="#ababab"
          style="text-shadow: 1px 1px 2px #333"
        >
          <b-carousel-slide img-src="@/static/camper-site.jpg">
          </b-carousel-slide>
          <b-carousel-slide img-src="@/static/front-rv-parked.jpg">
          </b-carousel-slide>
          <b-carousel-slide img-src="@/static/side-rv-parked.jpg">
          </b-carousel-slide>
        </b-carousel>
        <div class="content p-3">
          <h3>Info</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus qui
            quaerat eveniet! Corporis eos reiciendis corrupti optio fugit quasi
            necessitatibus maiores est vitae voluptates officiis commodi
            excepturi tenetur, libero autem.Doloribus aspernatur quae
            consequatur asperiores quibusdam, pariatur rerum vero est sed
            laboriosam accusamus! Nihil vero fugit esse, dignissimos
            exercitationem in, explicabo molestiae soluta tempora minus vitae
            asperiores voluptate, porro error.
          </p>

          <b-button variant="primary" to="/about">About Us</b-button>
        </div>
      </b-card> -->
    </main>
  </div>
</template>

<script>
import GMap from "@/components/GMap";

export default {
  name: "Home",
  components: {
    GMap,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
#home {
  .header {
    width: 100%;
    height: 45vh;
    padding: 0;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(#030512, 0.5);
    }
    .main {
      position: absolute;
      margin: auto;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      text-align: center;
      height: 50%;
      color: $white;
      h1,
      h2 {
        font-weight: 800;
      }
      .btn {
        font-weight: 600;
      }
    }
    img {
      width: 100%;
      height: 100%;
      -o-object-fit: cover;
      object-fit: cover;
      -o-object-position: 50% 65%;
      object-position: 50% 65%;
    }
  }
  main {
    display: flex;
    justify-content: center;
    padding: 4rem;
  }
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    border: 0;
  }
}
.card {
  background-color: $secondary;
  color: $white;
}
</style>
