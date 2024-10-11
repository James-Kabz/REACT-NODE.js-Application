import React, { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLoggedIn = localStorage.getItem("isLoggedIn");
    return savedLoggedIn === "true";
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole");
  });

  const [roleId, setRoleId] = useState(() => {
    return localStorage.getItem("roleId");
  }); // Initialize roleId state

  const login = (roleId) => {
    setIsLoggedIn(true);
    setRoleId(roleId); // Set roleId in state
    setUserRole(roleId); // Optionally, if userRole is the same as roleId
    // Save login state and roleId to localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("roleId", roleId); // Store roleId
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRoleId(null); // Clear roleId on logout
    setUserRole(null); // Clear userRole

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("roleId"); // Remove roleId from localStorage
  };

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("roleId"); // Remove roleId if not logged in
    }
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, userRole, roleId }}
    >
      {" "}
      {/* Provide roleId in context */}
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
