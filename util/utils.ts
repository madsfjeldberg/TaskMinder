import { FirebaseError } from "firebase/app";

const getErrorMessage = (error: FirebaseError) => {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please try logging in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled. Please contact support.";
    case "auth/weak-password":
      return "Please choose a stronger password (at least 6 characters).";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/user-not-found":
      return "User not found. Please check your email and password.";
    case "auth/missing-password":
      return "Please enter a password.";
    case "auth/invalid-credential":
      return "Invalid email or password. Please try again.";
    default:
      return error.code, error.message;
  }
};

export { getErrorMessage };
