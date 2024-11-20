import React, { createContext, useState, useContext, useEffect } from "react";

// Function to fetch role and permissions data from the API
const fetchRoleAndPermissions = async (roleId) => {
  try {
    const response = await fetch(`http://localhost:4000/api/roles/${roleId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Extract the permission names
    const permissions = data.permissions.map(
      (permission) => permission.permissionName
    );

    console.log("Fetched Role Name:", data.roleName);
    console.log("Fetched Permissions:", permissions);

    return {
      roleName: data.roleName,
      permissions: permissions,
    };
  } catch (error) {
    console.error("Failed to fetch role and permissions:", error);
    throw error;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLoggedIn = localStorage.getItem("isLoggedIn");
    return savedLoggedIn === "true";
  });

  const [userRole, setUserRole] = useState(() =>
    localStorage.getItem("userRole")
  );
  const [roleId, setRoleId] = useState(() => localStorage.getItem("roleId"));
  const [permissions, setPermissions] = useState(() => {
    const savedPermissions = localStorage.getItem("permissions");
    return savedPermissions ? JSON.parse(savedPermissions) : [];
  });

  /**
   * Login function to authenticate the user and fetch role data.
   * @param {string} roleId - The role ID of the logged-in user.
   */
  const login = async (roleId) => {
    if (!roleId) {
      console.error("roleId is undefined or null");
      return;
    }

    setIsLoggedIn(true);
    setRoleId(roleId);

    try {
      // Fetch role name and permissions
      const { roleName, permissions } = await fetchRoleAndPermissions(roleId);
      setUserRole(roleName);
      setPermissions(permissions);

      // Persist user data in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("roleId", roleId);
      localStorage.setItem("userRole", roleName);
      localStorage.setItem("permissions", JSON.stringify(permissions));
    } catch (error) {
      console.error("Login failed:", error);
      logout();
    }
  };

  /**
   * Logout function to clear user data and reset context.
   */
  const logout = () => {
    setIsLoggedIn(false);
    setRoleId(null);
    setUserRole(null);
    setPermissions([]);

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("roleId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("permissions");
  };

  /**
   * Check if the user has a specific permission.
   * @param {string} permissionName - The permission to check.
   * @returns {boolean} - True if the user has the permission, false otherwise.
   */
  const hasPermission = (permissionName) =>
    permissions.includes(permissionName);

  /**
   * Get the user’s role.
   * @returns {string} - The role of the logged-in user.
   */
  const getRole = () => userRole;

  useEffect(() => {
    // Clear localStorage data if user is logged out
    if (!isLoggedIn) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("roleId");
      localStorage.removeItem("userRole");
      localStorage.removeItem("permissions");
    }
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        userRole,
        roleId,
        permissions,
        hasPermission,
        getRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access AuthContext.
 * @returns {Object} - AuthContext values.
 */
export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContext;
};
