/**
 * Authentication service for handling login API calls
 */

const API_BASE_URL = "https://reqres.in/api";
const API_KEY = "reqres-free-v1";

export const authService = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{token: string}>} - Login response with token
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      return data;
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  },

  /**
   * Check if user has valid token in localStorage
   * @returns {boolean} - True if token exists
   */
  isAuthenticated() {
    const token = localStorage.getItem("authToken");
    return !!token;
  },

  /**
   * Get stored token from localStorage
   * @returns {string|null} - Token or null if not found
   */
  getToken() {
    return localStorage.getItem("authToken");
  },

  /**
   * Store token in localStorage
   * @param {string} token - JWT token
   */
  setToken(token) {
    localStorage.setItem("authToken", token);
  },

  /**
   * Remove token from localStorage
   */
  removeToken() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },
};
