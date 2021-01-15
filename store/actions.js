export default {
  async nuxtServerInit({ dispatch }, ctx) {
    // INFO -> Nuxt-fire Objects can be accessed in nuxtServerInit action via this.$fire___, ctx.$fire___ and ctx.app.$fire___'
    /** Get the VERIFIED authUser on the server */
    console.log(ctx);
    if (ctx.res && ctx.res.locals && ctx.res.locals.user) {
      const { allClaims: claims, ...authUser } = ctx.res.locals.user;

      console.info(
        "Auth User verified on server-side. User: ",
        authUser,
        "Claims:",
        claims
      );
      await dispatch("onAuthStateChanged", {
        authUser,
        claims,
      });
    }
  },
  async setAuth({ commit }, authUser) {
    commit("SET_AUTH_USER", { authUser });
  },

  async onAuthStateChanged({ commit }, { authUser }) {
    if (!authUser) {
      commit("RESET_USER");
      return;
    }
    if (authUser && authUser.getIdToken) {
      try {
        const idToken = await authUser.getIdToken(true);
      } catch (e) {
        console.error(e);
      }
    }
    commit("SET_AUTH_USER", { authUser });
  },
  async setReservationDetails({ commit }, details) {
    console.log(details);
    commit("SET_RESERVATION_DETAILS", details);
  },
  async getSites({ commit }) {
    try {
      const response = await this.$axios.get(
        "https://us-central1-llano-estacado-rv-park.cloudfunctions.net/webApi/sites"
      );
      // const response = await this.$axios.get(
      //   "http://localhost:5001/llano-estacado-rv-park/us-central1/webApi/sites"
      // );
      commit("SET_SITES", response.data);
    } catch (e) {
      console.error(e);
    }
  },
  checkVuexStore(ctx) {
    if (this.$fire.auth === null) {
      throw "Vuex Store example not working - this.$fire.auth cannot be accessed.";
    }

    alert(
      "Success. Nuxt-fire Objects can be accessed in store actions via this.$fire___"
    );
  },
};
