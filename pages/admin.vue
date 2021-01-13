<template>
  <b-tabs pills card vertical>
    <b-tab title="Site Map" active>
      <main>
        <h2>Site Map</h2>
        <SiteMap admin />
      </main>
    </b-tab>
    <b-tab title="Sites"><b-card-text>Tab contents 2</b-card-text></b-tab>
    <!-- <b-tab title="Tab 3"><b-card-text>Tab contents 3</b-card-text></b-tab> -->
  </b-tabs>
</template>

<script>
import SiteMap from "@/components/SiteMap";
export default {
  name: "admin",
  components: {
    SiteMap,
  },
};
</script>

<style lang="scss" >
</style>