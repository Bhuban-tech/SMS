import { API_BASE_URL, ENDPOINTS } from "../config/api";
export const getAuthToken = () => localStorage.getItem("token") || "";


const requireAuth = () => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required. Please log in again.");
  return token;
};


export const fetchEsewaTransactions = async () => {
  const token = requireAuth();
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.ESEWA_TRANSACTIONS}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch eSewa transactions");
  }

  const data = await res.json();
  const transactions = Array.isArray(data) ? data : data.data || data.transactions || [];
  return transactions.map((t) => ({ ...t, paymentMethod: "esewa" }));
};

export const fetchKhaltiTransactions = async () => {
  const token = requireAuth();
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.KHALTI_TRANSACTIONS}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch Khalti transactions");
  }

  const data = await res.json();
  const transactions = Array.isArray(data) ? data : data.data || data.transactions || [];
  return transactions.map((t) => ({ ...t, paymentMethod: "khalti" }));
};

// ===== Top-Up Initiation =====
export const initiateTopUp = async (method, amount) => {
  const token = requireAuth();
  const endpoint = method === "khalti" ? ENDPOINTS.KHALTI_INITIATE : ENDPOINTS.ESEWA_INITIATE;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }), // Keep decimal precision (no Math.round)
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || result.error || "Payment initiation failed");
  }

  return result;
};

// ===== Verification =====
export const verifyKhaltiPayment = async (pidx) => {
  const token = requireAuth();
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.KHALTI_VERIFY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ pidx }),
  });

  const result = await res.json();

  if (!res.ok || result.data?.status !== "Completed") {
    throw new Error(result.message || "Khalti verification failed");
  }

  return result;
};

export const verifyEsewaPayment = async (data) => {
  const token = requireAuth();
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.ESEWA_VERIFY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `eSewa verification failed (Status: ${res.status})`
    );
  }

  return await res.json();
};