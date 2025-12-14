import { API_BASE_URL, ENDPOINTS } from "@/config/api";
import { getAuthHeaders } from "./auth";

export const fetchContacts = async () => {
  const res = await fetch(API_BASE_URL + ENDPOINTS.GET_ALL_CONTACTS, {
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const createContact = (data) =>
  fetch(API_BASE_URL + ENDPOINTS.CREATE_CONTACT, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const updateContact = (id, data) =>
  fetch(API_BASE_URL + ENDPOINTS.UPDATE_CONTACT(id), {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

export const deleteContact = (id) =>
  fetch(API_BASE_URL + ENDPOINTS.DELETE_CONTACT(id), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
