import { useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true; // treat as expired if anything fails
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("access_token");

        if (!token || isTokenExpired(token)) {
          logout();
        } else if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        logout();
      } finally {
        setAuthChecked(true);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback((userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authChecked,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
