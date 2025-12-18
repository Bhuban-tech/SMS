import { API_BASE_URL, ENDPOINTS } from "@/config/api";
// import { getAuthHeaders } from "./auth";


export const getHeaders =(token) =>({
    "Content-type":"application/json",
    Authorization : `Bearer ${token}`,
});

export const fetchContacts = async (token) => {
  const res = await fetch(API_BASE_URL + ENDPOINTS.GET_ALL_CONTACTS, {
    headers: getHeaders(token),
  });
  return res.json();
};

// export const fetchContacts = async (token) => {
//   const res = await fetch(API_BASE_URL + ENDPOINTS.GET_ALL_CONTACTS, {
//     headers: getHeaders(token),
//   });

//   if (!res.ok) {
//     const text = await res.text(); 
//     throw new Error(`Failed to fetch contacts: ${res.status} ${text}`);
//   }

//   return res.json();
// };


export const createContact = (data) =>
  fetch(API_BASE_URL + ENDPOINTS.CREATE_CONTACT, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

export const updateContact = (id, data) =>
  fetch(API_BASE_URL + ENDPOINTS.UPDATE_CONTACT(id), {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

export const deleteContact = (id) =>
  fetch(API_BASE_URL + ENDPOINTS.DELETE_CONTACT(id), {
    method: "DELETE",
    headers: getHeaders(),
  });
