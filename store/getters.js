export default {
  isLoggedIn: (state) => {
    try {
      console.log('teeest')
      return state.authUser.uid !== null
    } catch {
      return false
    }
  }
}
