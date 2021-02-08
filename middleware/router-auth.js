export default function ({ store, redirect, route }) {
  store.state.authUser == null && (isAuthRoute(route) || isAdminRoute(route))
    ? redirect("/")
    : "";
  store.state.authUser != null &&
  store.state.authUser.email != "admin@admin.com" &&
  isAdminRoute(route)
    ? redirect("/")
    : "";
  store.state.bookingDetails == undefined && isPaymentRoute(route)
    ? redirect("/sites")
    : "";
  store.state.authUser != null && isLoginRoute(route) ? redirect("/") : "";
}

function isAuthRoute(route) {
  if (route.matched.some((record) => record.path == "/dashboard")) {
    return true;
  }
}
function isAdminRoute(route) {
  if (route.matched.some((record) => record.path == "/admin")) {
    return true;
  }
}
function isLoginRoute(route) {
  if (route.matched.some((record) => record.path == "/login")) {
    return true;
  }
}
function isPaymentRoute(route) {
  if (route.matched.some((record) => record.path == "/payment")) {
    return true;
  }
}
