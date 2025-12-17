
import { API_BASE_URL } from "@/config/api";
import { toast } from "sonner";

export const fetchDeliveryReportsAPI = async (token) => {
  if (!token) {
    toast.error("Please login again");
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/api/delivery-reports`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return Array.isArray(data?.data) ? data.data : data || [];
};
