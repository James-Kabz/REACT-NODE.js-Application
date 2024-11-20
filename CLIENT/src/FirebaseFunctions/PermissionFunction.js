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
export const addPermission = async (permissionName) => {
  if (!permissionName.trim()) {
    throw new Error("Permission name cannot be empty");
  }

  const permissionData = {
    permissionName: permissionName.trim(),
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser ? auth.currentUser.uid : "Unknown",
  };

  const permissionRef = await addDoc(collection(db, "permissions"), permissionData);
  return permissionRef.id;
};

// Update a role in Firestore
export const updatePermission = async (permissionId, permissionName) => {
  const permissionDoc = doc(db, "permissions", permissionId);
  await updateDoc(permissionDoc, { permissionName });
};

// Delete a role from Firestore
export const deletePermission = async (permissionId) => {
  try {
    if (!permissionId) {
      throw new Error("Permission ID is undefined or invalid");
    }
    const permissionDoc = doc(db, "permissions", permissionId);
    await deleteDoc(permissionDoc);
  } catch (error) {
    console.error("Error deleting permissions:", error.message);
    throw error;
  }
};

// get roles
export const getPermissions = async () => {
  const permissionsRef = collection(db, "permissions");
  const permissionsSnapshot = await getDocs(permissionsRef);
  const permissions = permissionsSnapshot.docs.map((doc) => ({
    id: doc.id, // Include the document ID
    ...doc.data(), // Spread the other data
  }));
  return permissions;
};
