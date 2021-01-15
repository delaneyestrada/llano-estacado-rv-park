import initialState from "./state";

export default {
  RESET_USER: (state) => {
    const newState = Object.assign(state, { authUser: null });
    console.log(newState);
    state = newState;
    console.log(state);
  },

  SET_AUTH_USER: (state, { authUser }) => {
    state.authUser = {
      uid: authUser.uid,
      email: authUser.email,
      isAdmin: authUser.email == "admin@admin.com" ? true : false,
    };
  },
  SET_RESERVATION_DETAILS: (state, details) => {
    state.reservationDetails = details;
  },
  SET_SITES: (state, sites) => {
    state.sites = sites;
  },
};
