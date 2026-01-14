import { API_BASE_URL } from "@/config/api";

export const fetchDailyReport = async (adminId, startDate, endDate) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Authentication required");

  const params = new URLSearchParams({
    admin_id: adminId,
    start_date: startDate,
    end_date: endDate,
  });

  const response = await fetch(`${API_BASE_URL}/api/reports/daily?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // const errorText = await response.text();
    // let errorMessage = "Failed to fetch daily report";
    let errorMessage = "no data avalible here  so sorry guys la ";
    try {
      // const errorJson = JSON.parse(errorText);
      // errorMessage += `: ${errorJson.message || errorText}`;
       let errorMessage = "no data avalible here  so sorry guys lala ";
    } catch {
      // errorMessage += `: ${errorText}`;
       let errorMessage = "no data avalible here  so sorry guys lala  ";
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const fetchMonthlyReport = async (adminId, year) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Authentication required");

  const params = new URLSearchParams({
    admin_id: adminId,
    year: year,
  });

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