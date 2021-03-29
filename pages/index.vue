<template>
  <div id="home">
    <div class="header">
      <div class="main">
        <h1>Lubbock's Premium RV Park</h1>
        <h2>Weekly and Monthly Rentals</h2>
        <b-button variant="primary" to="/sites">Book A Site</b-button>
      </div>
      <img src="@/static/rv-driving-llano.jpg" alt="" />
    </div>
    <main>
      <b-carousel
        id="carousel-1"
        controls
        background="#ababab"
        style="text-shadow: 1px 1px 2px #333"
      >
        <!-- <b-carousel-slide >
          <template #img>
            <div class="img-container">
              <img
                class="d-block img-fluid w-100"
                src="@/static/camper-site.jpg"
                alt="image slot"
              />
            </div>
          </template>
        </b-carousel-slide> -->
        <b-carousel-slide img-src="@/static/camper-site.jpg">
        </b-carousel-slide>
        <b-carousel-slide img-src="@/static/front-rv-parked.jpg">
        </b-carousel-slide>
        <b-carousel-slide img-src="@/static/side-rv-parked.jpg">
        </b-carousel-slide>
        <b-carousel-slide img-src="@/static/electrical.jpg"> </b-carousel-slide>
      </b-carousel>
      <b-card no-body>
        <div
          class="content d-flex justify-content-center align-items-center p-3"
        >
          <div>
            <p>
              Llano Estacado RV Park is the place to park your RV in Lubbock,
              TX. Conveniently located near major highways, oversized spots, and
              locally owned.
            </p>

            <b-button variant="primary" to="/about">About Us</b-button>
          </div>
        </div>
      </b-card>
    </main>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },
};
</script>

<style lang="scss">
#home {
  .content {
    p {
      font-size: 1.2rem;
    }
  }
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
      background-color: rgba(#030512, 0.65);
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
      h1 {
        font-weight: 900;
      }
      h2 {
        font-weight: 400;
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
    flex-direction: column;
    justify-content: center;
    padding: 4rem;
  }

  #carousel-1 * {
    height: 40vh;
    background-color: $dark;
  }

  #carousel-1 a,
  #carousel-1 a span {
    background-color: transparent !important;
  }
  #carousel-1 img {
    object-fit: contain;
  }

  // @media screen and (min-width: 775px) {
  //   .card {
  //     display: grid;
  //     grid-template-columns: 1fr 2fr;
  //     width: 100%;
  //     border: 0;
  //   }
  // }
  // @media screen and (max-width: 775px) {
  .card {
    display: flex;
    flex-direction: column;
    border: 0;
    border-radius: 0;
  }
  // }
}
.card {
  background-color: $secondary;
  color: $white;
}
</style>
