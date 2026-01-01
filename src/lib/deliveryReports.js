import { API_BASE_URL } from "@/config/api";
import { toast } from "sonner";

export const fetchDeliveryReportsAPI = async (token) => {
  if (!token) {
    toast.error("Please login again");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/delivery-reports`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Unknown error";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (_) {
        try {
          errorMessage = await response.text();
        } catch (__) {}
      }
      throw new Error(`API error: ${response.status} - ${errorMessage}`);
    }

    const json = await response.json();

    if (json.success === false) {
      toast.error(json.message || "Failed to fetch delivery reports");
      return [];
    }

    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("fetchDeliveryReportsAPI error:", error);

    const msg = error.message || "";
    if (msg.includes("401")) {
      toast.error("token expired. Please login again.");
    } else if (msg.includes("403")) {
      toast.error("You don't have permission to view reports.");
    } else if (msg.includes("404")) {
      toast.error("Delivery reports endpoint not found.");
    } else {
      toast.error("Failed to load delivery reports. Please try again.");
    }

    return [];
  }
};


export const fetchSingleDeliveryReportAPI = async (token, reportId) => {
  if (!token) {
    toast.error("Please login again");
    return null;
  }

  if (!reportId) {
    toast.error("Invalid report ID");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/delivery_reports/${reportId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Unknown error";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (_) {
        try {
          errorMessage = await response.text();
        } catch (__) {}
      }
      throw new Error(`API error: ${response.status} - ${errorMessage}`);
    }

    const json = await response.json();

    if (json.success === false) {
      toast.error(json.message || "Failed to fetch report details");
      return null;
    }

    return json.data || null;
  } catch (error) {
    console.error("fetchSingleDeliveryReportAPI error:", error);
    toast.error("Failed to load report details");

  
    if (error.message.includes("404")) {
      toast.error("Report not found");
    }

    return null;
  }
};