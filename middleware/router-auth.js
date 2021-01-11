export default function ({ store, redirect, route }) {
  store.state.authUser == null && (isAuthRoute(route) || isAdminRoute(route))
    ? redirect("/")
    : "";
  store.state.authUser != null &&
  store.state.authUser.email != "admin@admin.com" &&
  isAdminRoute(route)
    ? redirect("/")
    : "";
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
