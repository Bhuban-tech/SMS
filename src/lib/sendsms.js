// /lib/sendsms.js

import { API_BASE_URL, ENDPOINTS } from "@/config/api";

export const getHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// Individual SMS
export const sendIndividualSMS = async (token, senderId, message, recipientNumbers) => {
  console.log("sendIndividualSMS called with:", { senderId, recipientNumbers });
  
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SEND_MESSAGE}`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ 
      senderId: senderId,  
      content: message, 
      recipientNumbers: recipientNumbers 
    }),
  });
  
  const result = await response.json();
  
  return result;
};

// Group SMS
export const sendGroupSMS = async (token, senderId, groupId, message) => {

  
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SEND_MESSAGE}`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ 
      senderId: senderId,  // ← Make sure this is senderId
      content: message, 
      recipientGroupIds: [groupId] 
    }),
  });
  
  const result = await response.json();

  return result;
};

// Bulk SMS / bulk upload
export const sendBulkSMS = async (token, senderId, groupName, file) => {

  
  const form = new FormData();
  form.append("file", file);
  form.append(
    "groupRequest",
    new Blob(
      [JSON.stringify({ name: groupName.trim(), senderId })],
      { type: "application/json" }
    )
  );

  const response = await fetch(
    `${API_BASE_URL}${ENDPOINTS.BULK_ADD_CONTACTS_TO_GROUP}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    }
  );

  const text = await response.text();
  const result = text ? JSON.parse(text) : { success: true };
  return result;
};


export const createTemplate = async (token, templateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CREATE_TEMPLATE}`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(templateData),
    });
    return response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getTemplateSMS = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_TEMPLATES}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        status: response.status,
        message: errorText || "Forbidden",
      };
    }

    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getTemplateByName = async (token, name) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_TEMPLATE(name)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateTemplate = async (token, id, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPDATE_TEMPLATE(id)}`, {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify(updateData),
    });
    return response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteTemplate = async (token, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DELETE_TEMPLATE(id)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};


export const sendTemplateSMS = async (token, adminId, csvData, content) => {

  
  const phoneNumbers = csvData.map((row) => row.phoneNo || row.phone || row.phoneNumber).filter(Boolean);

  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SEND_MESSAGE}`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({
      senderId: adminId, 
      content: content,
      recipientNumbers: phoneNumbers,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("sendTemplateSMS error:", text);
    throw new Error(text || "Failed to send template SMS");
  }

  const result = await response.json();

  return result;
};