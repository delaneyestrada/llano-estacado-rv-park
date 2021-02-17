<template>
  <b-container>
    <h2 class="header mt-5 mb-2">About Us</h2>
    <section id="about">
      <div class="main">
        <GMap />
        <b-card>
          <h3>Lubbock's Premium RV Park</h3>
          <span>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
            placeat cum ipsa dolore magnam, dicta saepe omnis in at soluta
            molestiae. Neque molestiae magnam obcaecati labore asperiores,
            quibusdam dicta deleniti? Hic reprehenderit numquam quae, ducimus
            quaerat recusandae libero suscipit modi delectus fugit repudiandae
            quia deserunt? Distinctio saepe in rerum minus minima cum aliquam a
            expedita facere! Repudiandae alias quibusdam vitae? Quo numquam
            mollitia quaerat minus quam, libero porro doloremque veniam eum,
            velit accusantium itaque molestiae culpa perspiciatis minima
            assumenda omnis, ut aperiam. Ad quo sequi debitis odio recusandae
            voluptate nesciunt?
          </span>
          <h4 class="my-3">Amenities</h4>
          <span
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            earum consequatur, eveniet illum totam alias, cupiditate
            reprehenderit reiciendis illo optio, adipisci commodi natus
            voluptatum! Cupiditate corrupti magnam eveniet molestiae fuga!</span
          >
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
</style>