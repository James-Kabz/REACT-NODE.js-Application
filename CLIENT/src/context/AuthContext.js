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

    // Log to verify the transformed permissions array
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

  const login = async (roleId) => {
    if (!roleId) {
      console.error("roleId is undefined or null");
      return;
    }

    setIsLoggedIn(true);
    setRoleId(roleId);

    try {
      const { roleName, permissions } = await fetchRoleAndPermissions(roleId);
      setUserRole(roleName);
      setPermissions(permissions);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("roleId", roleId);
      localStorage.setItem("userRole", roleName);
      localStorage.setItem("permissions", JSON.stringify(permissions));
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoggedIn(false);
      setRoleId(null);
      setUserRole(null);
      setPermissions([]);
    }
  };

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

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("roleId");
      localStorage.removeItem("userRole");
      localStorage.removeItem("permissions");
    }
  }, [isLoggedIn]);

  const hasPermission = (permissionName) =>
    permissions.includes(permissionName);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, userRole, roleId, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContext;
};
