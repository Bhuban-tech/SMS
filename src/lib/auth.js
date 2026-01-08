"use client";

import { API_BASE_URL, ENDPOINTS } from "@/config/api";

/**
 * Get authorization headers for API calls
 * Reads token from localStorage (synced with Redux via persist)
 */
export const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Login user and return token + user data
 * @param {string} loginInput - Username or email
 * @param {string} password - User password
 * @returns {Promise<{token: string, user: object}>}
 */
export const login = async (loginInput, password) => {
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ login: loginInput, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  // Extract data from API response
  const { token, username, email, id } = data.data;

  const user = {
    username,
    email,
    id,
  };

  // Store token in localStorage (redux-persist will sync Redux state)
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return { token, user };
};

/**
 * Centralized logout function
 * Clears all auth data from localStorage, cookies, and Redux
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} router - Next.js router
 * @param {Function} logoutAction - Redux logout action
 */
export const handleLogout = (dispatch, router, logoutAction) => {
  // Clear localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminId");
  }

  // Clear cookies
  if (typeof document !== "undefined") {
    document.cookie = "token=; path=/; max-age=0";
  }

  // Dispatch Redux logout action
  dispatch(logoutAction());

  // Redirect to home/login page
  router.replace("/");
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  
  return !!(token && user);
};

/**
 * Get current user from localStorage
 * @returns {object|null}
 */
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;
  
  const userStr = localStorage.getItem("user");
  
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

/**
 * Refresh token (if your API supports it)
 * @returns {Promise<string>} New token
 */
export const refreshToken = async () => {
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.REFRESH_TOKEN}`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Token refresh failed");
  }

  const { token } = data.data;

  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }

  return token;
};