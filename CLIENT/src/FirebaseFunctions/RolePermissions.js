import { db } from "../SERVER/Firebase";

import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export const updatePermissionsForRole = async (roleId, newPermissionIds) => {
  if (!roleId || !newPermissionIds || !Array.isArray(newPermissionIds)) {
    throw new Error("Invalid role ID or permissions");
  }

  const rolePermissionsCollection = collection(db, "rolePermissions");

  // Step 1: Delete existing permissions
  const q = query(rolePermissionsCollection, where("roleId", "==", roleId));
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));

  // Step 2: Add new permissions
  const addPromises = newPermissionIds.map((permissionId) =>
    addDoc(rolePermissionsCollection, { roleId, permissionId })
  );

  try {
    await Promise.all([...deletePromises, ...addPromises]);
    return true;
  } catch (error) {
    console.error("Failed to update permissions for role:", error.message);
    throw error;
  }
};

export const assignPermissionsToRole = async (roleId, permissionIds) => {
  if (!roleId || !permissionIds || !Array.isArray(permissionIds)) {
    throw new Error("Invalid role ID or permissions");
  }

  const rolePermissionsCollection = collection(db, "rolePermissions");
  const promises = permissionIds.map((permissionId) =>
    addDoc(rolePermissionsCollection, { roleId, permissionId })
  );

  try {
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error("Failed to assign permissions to role:", error.message);
    throw error;
  }
};

export const getPermissionsForRole = async (roleId) => {
  if (!roleId) {
    throw new Error("Role ID is required");
  }

  const rolePermissionsCollection = collection(db, "rolePermissions");
  const permissionsCollection = collection(db, "permissions");

  try {
    // Fetch rolePermissions entries for the role
    const q = query(rolePermissionsCollection, where("roleId", "==", roleId));
    const snapshot = await getDocs(q);

    const permissionIds = snapshot.docs.map((doc) => doc.data().permissionId);

    // Fetch permission details using the IDs
    const permissions = [];
    for (const permissionId of permissionIds) {
      const permissionDoc = await getDocs(
        query(permissionsCollection, where("__name__", "==", permissionId))
      );
      if (!permissionDoc.empty) {
        permissions.push({ id: permissionId, ...permissionDoc.docs[0].data() });
      }
    }

    return permissions;
  } catch (error) {
    console.error("Failed to fetch permissions for role:", error.message);
    throw error;
  }
};
