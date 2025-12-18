import { API_BASE_URL, ENDPOINTS } from "@/config/api";

export const getHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
});

// FETCH CONTACTS
export const fetchContacts = async (token) => {
  const res = await fetch(API_BASE_URL + ENDPOINTS.GET_ALL_CONTACTS, {
    headers: getHeaders(token),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch contacts: ${res.status} ${text}`);
  }

  return res.json();
};

// CREATE CONTACT
export const createContact = async (token, data) =>
  fetch(API_BASE_URL + ENDPOINTS.CREATE_CONTACT, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

// UPDATE CONTACT
export const updateContact = async (token, id, data) =>
  fetch(API_BASE_URL + ENDPOINTS.UPDATE_CONTACT(id), {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

// DELETE CONTACT
export const deleteContact = async (token, id) =>
  fetch(API_BASE_URL + ENDPOINTS.DELETE_CONTACT(id), {
    method: "DELETE",
    headers: getHeaders(token),
  }).then((r) => r.json());
