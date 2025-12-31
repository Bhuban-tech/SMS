// report.js
import { API_BASE_URL, ENDPOINTS } from "../config/api";

// Get auth token
export const getAuthToken = () => localStorage.getItem("token") || "";

// ===== Transactions =====
export const fetchEsewaTransactions = async () => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.ESEWA_TRANSACTIONS}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch eSewa transactions");
  const data = await res.json();
  return data.map((t) => ({ ...t, paymentMethod: "esewa" }));
};

export const fetchKhaltiTransactions = async () => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.KHALTI_TRANSACTIONS}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Khalti transactions");
  const data = await res.json();
  return data.map((t) => ({ ...t, paymentMethod: "khalti" }));
};

// ===== Top-Up =====
export const initiateTopUp = async (method, amount) => {
  const token = getAuthToken();
  const endpoint = method === "khalti" ? ENDPOINTS.KHALTI_INITIATE : ENDPOINTS.ESEWA_INITIATE;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ amount: Math.round(amount) }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Payment initiation failed");
  return result;
};

// ===== Verification =====
export const verifyKhaltiPayment = async (pidx) => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.KHALTI_VERIFY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ pidx }),
  });
  const result = await res.json();
  if (!res.ok || result.data?.status !== "Completed") throw new Error("Khalti verification failed");
  return result;
};

export const verifyEsewaPayment = async (data) => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.ESEWA_VERIFY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ data }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "eSewa verification failed");
  return result;
};
