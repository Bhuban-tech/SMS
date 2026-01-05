import { API_BASE_URL } from "@/config/api";

/**
 * Fetch Daily Report Data
 * @param {string|number} adminId 
 * @param {string} startDate   // Format: YYYY-MM-DD
 * @param {string} endDate     // Format: YYYY-MM-DD
 * @returns {Promise<Object>}
 */
export const fetchDailyReport = async (adminId, startDate, endDate) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Authentication required");

  const params = new URLSearchParams({
    admin_id: adminId,
    start_date: startDate,
    end_date: endDate,
  });

  // Correct endpoint: /api/reports/daily
  const response = await fetch(`${API_BASE_URL}/api/reports/daily?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "Failed to fetch daily report";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage += `: ${errorJson.message || errorText}`;
    } catch {
      errorMessage += `: ${errorText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * Fetch Monthly Report Data
 * @param {string|number} adminId 
 * @param {number} year           // e.g. 2026
 * @returns {Promise<Object>}
 */
export const fetchMonthlyReport = async (adminId, year) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Authentication required");

  const params = new URLSearchParams({
    admin_id: adminId,
    year: year,
  });

  // Correct endpoint: /api/reports/monthly
  const response = await fetch(`${API_BASE_URL}/api/reports/monthly?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "Failed to fetch monthly report";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage += `: ${errorJson.message || errorText}`;
    } catch {
      errorMessage += `: ${errorText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};