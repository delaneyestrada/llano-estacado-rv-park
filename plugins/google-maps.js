import Vue from "vue";
import * as GmapVue from "~/node_modules/gmap-vue";

Vue.use(GmapVue, {
  load: {
    key: "AIzaSyDszoPLeaA632JMvuThtT_ymwHuPADG33I",
    libraries: "places",
    installComponents: true,
  },
});
