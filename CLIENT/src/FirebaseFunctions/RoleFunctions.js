import { db, auth } from "../SERVER/Firebase";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

// Add a role to Firestore
export const addRole = async (roleName) => {
  if (!roleName.trim()) {
    throw new Error("Role name cannot be empty");
  }

  const roleData = {
    roleName: roleName.trim(),
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser ? auth.currentUser.uid : "Unknown",
  };

  const roleRef = await addDoc(collection(db, "roles"), roleData);
  return roleRef.id;
};

// Update a role in Firestore
export const updateRole = async (roleId, roleName) => {
  const roleDoc = doc(db, "roles", roleId);
  await updateDoc(roleDoc, { roleName });
};

// Delete a role from Firestore
export const deleteRole = async (roleId) => {
  try {
    if (!roleId) {
      throw new Error("Role ID is undefined or invalid");
    }
    const roleDoc = doc(db, "roles", roleId);
    await deleteDoc(roleDoc);
  } catch (error) {
    console.error("Error deleting role:", error.message);
    throw error;
  }
};


// get roles
export const getRoles = async () => {
  const rolesRef = collection(db, "roles");
  const rolesSnapshot = await getDocs(rolesRef);
  const roles = rolesSnapshot.docs.map((doc) => ({
    id: doc.id, // Include the document ID
    ...doc.data(), // Spread the other data
  }));
  return roles;
};

