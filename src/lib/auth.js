"use client";

import { API_BASE_URL, ENDPOINTS } from "@/config/api";

export const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Login user and return token + user data
 * Also manually sets the access_token cookie for proxy.js to detect
 */
export const login = async (loginInput, password) => {
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Important for cookies if backend sets them
    body: JSON.stringify({ login: loginInput, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  const { token, username, email, id } = data.data;

  const user = {
    username,
    email,
    id,
  };

  // Save to localStorage (for Redux persistence and client-side use)
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // CRITICAL FIX: Manually set the cookie that proxy.js checks for
    // This ensures server-side proxy sees the user as authenticated
    document.cookie = `access_token=${token}; Path=/; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`; // 7 days
  }

  return { token, user };
};

/**
 * Clears all auth data
 */
export const handleLogout = (dispatch, router, logoutAction) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminId");
  }

  if (typeof document !== "undefined") {
    // Clear both possible token cookies
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "access_token=; path=/; max-age=0"; // Clear the one proxy uses
  }

  dispatch(logoutAction());
  router.replace("/");
};

/**
 * Check if user is authenticated (client-side)
 */
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  
  return !!(token && user);
};

/**
 * Get current user
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
 * Refresh token
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
    // Also update the cookie so proxy.js stays happy
    document.cookie = `access_token=${token}; Path=/; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`;
  }

  return token;
};