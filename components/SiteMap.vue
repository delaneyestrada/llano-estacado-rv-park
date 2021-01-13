<template>
  <div>
    <img id="site-map" src="https://via.placeholder.com/1920x1080" alt="" />
  </div>
</template>

<script>
export default {
  name: "SiteMap",
  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (this.admin) {
      console.log("Admin");
    }
  },
};
</script>

<style lang="scss" scoped>
#site-map {
  width: 100%;
}
</style>