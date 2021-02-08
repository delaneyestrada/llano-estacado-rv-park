import initialState from "./state";

export default {
  RESET_USER: (state) => {
    const newState = Object.assign(state, { authUser: null });
    console.log(newState);
    state = newState;
    console.log(state);
  },

  SET_AUTH_USER: (
    state,
    { authUser, subscriptions = null, isAdmin = false }
  ) => {
    let newState = {
      uid: authUser.uid,
      email: authUser.email,
      isAdmin: isAdmin,
      subscriptions: subscriptions,
      name: authUser.name,
    };
    // if (subscriptions) {
    //   newState = { ...newState, subscriptions };
    // }
    if (state.authUser) {
      newState = Object.assign(state.authUser, newState);
    }
    state.authUser = newState;
  },
  SET_RESERVATION_DETAILS: (state, details) => {
    state.reservationDetails = details;
  },
  SET_BOOKING_DETAILS: (state, details) => {
    state.bookingDetails = details;
  },
  REMOVE_RESERVATION_NAV: (state) => {
    if (state.reservationDetails) {
      const newReservationDetails = Object.assign(state.reservationDetails, {
        redirectPayment: false,
      });
      state.reservationDetails = newReservationDetails;
    }
  },
  SET_SITES: (state, sites) => {
    state.sites = sites;
  },
};
