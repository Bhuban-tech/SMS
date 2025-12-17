import { API_BASE_URL, ENDPOINTS } from "@/config/api";

export const fetchDashboardData = async () => {
  const token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");

  if (!token || !adminId) throw new Error("Authentication required");

  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_ADMIN(adminId)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `Error ${res.status}`);
  }

  const result = await res.json();
  if (!result.success) throw new Error(result.message || "Failed to fetch dashboard data");

  return result.data;
};
