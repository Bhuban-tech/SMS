
export const API_BASE_URL = "http://192.168.1.77:8080"; 
export const ENDPOINTS = {
  //auth
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",

  //admins
  GET_ADMIN: (id) => `/api/admins/${id}`,
  UPDATE_ADMIN: (id) => `/api/admins/update/${id}`,


  //individual contacts
  CREATE_CONTACT: "/api/contacts/add",
  UPDATE_CONTACT: (id) => `/api/contacts/update/${id}`,
  DELETE_CONTACT: (id) => `/api/contacts/delete/${id}`,
  GET_ALL_CONTACTS: "/api/contacts/all",


  //groups
  GET_ALL_GROUPS: "/api/groups/all",
  CREATE_GROUP: "/api/groups/create",
  UPDATE_GROUP: (id) => `/api/groups/update/${id}`,
  DELETE_GROUP: (id) => `/api/groups/delete/${id}`,
  CONTACTS_ADD_TO_GROUP: (id) => `/api/groups/${id}/contacts`,
  GET_GROUP_CONTACTS: (id) => `/api/groups/${id}`,
  BULK_ADD_CONTACTS_TO_GROUP: "/api/groups/contacts/bulk",
  REMOVE_CONTACT_FROM_GROUP : (groupId, contactId) =>`/api/groups/delete/${groupId}/contacts/${contactId}`,

  
  //delivery reports
  DELIVERY_REPORTS : (id) => `/api/message_recipients/${id}/delivery_reports`,

  //sms files
  SEND_MESSAGE: "/api/messages/send",

  //template messages
  CREATE_TEMPLATE:"/api/templates",
  GET_TEMPLATES:"/api/templates",
  UPDATE_TEMPLATE:(id) => `/api/templates/${id}`,
  DELETE_TEMPLATE:(id) => `/api/templates/${id}`,
  GET_TEMPLATE: (name) => `/api/templates/name/${name}`,

   // Payments
  ESEWA_TRANSACTIONS: "/api/esewa/transactions",
  KHALTI_TRANSACTIONS: "/api/khalti/payments",
  ESEWA_INITIATE: "/api/esewa/initiate",
  KHALTI_INITIATE: "/api/khalti/initiate",
  ESEWA_VERIFY: "/api/esewa/verify",
  KHALTI_VERIFY: "/api/khalti/verify"

};
