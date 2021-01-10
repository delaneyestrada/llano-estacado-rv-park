import Vue from "vue";
import * as VueGoogleMaps from "~/node_modules/vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDszoPLeaA632JMvuThtT_ymwHuPADG33I",
    libraries: "places",
  },
});
