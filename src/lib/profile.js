import { API_BASE_URL, ENDPOINTS } from '@/config/api';

const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;


export async function fetchProfile(adminId) {
  const token = getToken();
  if (!token) throw new Error('No token found');

  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_ADMIN(adminId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Failed to fetch profile (HTTP ${res.status})`);
  }

  const data = await res.json();
  return data.data;
}


export async function updateProfile(adminId, payload) {
  const token = getToken();
  if (!token) throw new Error('No token found');

  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.UPDATE_ADMIN(adminId)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(result.message || `Failed to update profile (HTTP ${res.status})`);
  }

  return result;
}
