const resetPassword = async (email, fire) => {
  try {
    await fire.auth.sendPasswordResetEmail(email);
    return { success: true };
  } catch (err) {
    return { success: false };
  }
};
export default resetPassword;
