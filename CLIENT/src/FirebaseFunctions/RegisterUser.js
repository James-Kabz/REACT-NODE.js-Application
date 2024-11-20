import { auth, db } from "../SERVER/Firebase"; // Adjust the path as necessary
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

/**
 * Adds a user to Firebase Authentication and Firestore.
 *
 * @param {string} email - The email of the user.
 * @param {string} password - The user's password.
 * @param {string} roleId - The user's role ID.
 */
export const RegisterUser = async (email, password, roleId) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Get user ID
    const uid = userCredential.user.uid;

    // Save user details to Firestore
    await setDoc(doc(db, "users", uid), {
      email,
      roleId,
    });

    return { success: true, message: "User added successfully!" };
  } catch (error) {
    console.error("Error adding user:", error);
    throw new Error(error.message || "Failed to add user");
  }
};
