"use client";

import { API_BASE_URL, ENDPOINTS } from "@/config/api";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const login = async (username, password) => {
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  localStorage.setItem("token", data.data.token);
  localStorage.setItem("user", JSON.stringify(data.data.user));

  return data.data;
};
