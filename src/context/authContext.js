import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user has valid token on app initialization
    if (authService.isAuthenticated()) {
      const token = authService.getToken();
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser({ token, authenticated: true });
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(email, password);

      if (response.token) {
        // Store token
        authService.setToken(response.token);

        // Create user object
        const userData = {
          email,
          token: response.token,
          authenticated: true,
        };

        // Store user data
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        return { success: true };
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.removeToken();
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    clearError,
    isAuthenticated: authService.isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
