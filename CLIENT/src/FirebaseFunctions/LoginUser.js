import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../SERVER/Firebase"; // Adjust the import path to your Firebase configuration

/**
 * Logs in a user using Firebase Authentication.
 *
 * @param {Object} data - The login credentials.
 * @param {string} data.email - The user's email.
 * @param {string} data.password - The user's password.
 * @returns {Promise<Object>} - The authenticated user's information.
 */
export const LoginUser = async ({ email, password }) => {
  try {
    // Authenticate the user with Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Extract user information
    const { user } = userCredential;

    return {
      success: true,
      userId: user.uid,
      email: user.email,
      message: "Login successful",
    };
  } catch (error) {
    // Handle Firebase errors
    let errorMessage = "Login failed";

    if (error.code === "auth/wrong-password") {
      errorMessage = "Invalid password. Please try again.";
    } else if (error.code === "auth/user-not-found") {
      errorMessage = "User not found. Please check your email or register.";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many attempts. Please try again later.";
    }

    throw new Error(errorMessage);
  }
};
