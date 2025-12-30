import { API_BASE_URL, ENDPOINTS } from "@/config/api";

export const getHeaders =(token) =>({
    "Content-type":"application/json",
    Authorization : `Bearer ${token}`,
});

export const fetchGroups = async (token) =>{
     console.log("TOKEN USED:", token);
    const response = await fetch (API_BASE_URL + ENDPOINTS.GET_ALL_GROUPS,{
        headers: getHeaders (token),
    })
    return response.json();
}

export const createGroup = async (token,name) => {
    const response = await fetch (API_BASE_URL + ENDPOINTS.CREATE_GROUP,{
        method:"POST",
        headers: getHeaders(token),
        body: JSON.stringify({name}),
    })// Group SMS
    return response.json();
}

export const updateGroup = async (token,id,name) => {
    const response = await fetch (API_BASE_URL + ENDPOINTS.UPDATE_GROUP(id),{
        method:"PUT",
        headers: getHeaders (token),
        body: JSON.stringify({name})
    })
    return response.json();
}

export const deleteGroup = async (token,id) => {
    const response = await fetch (API_BASE_URL + ENDPOINTS.DELETE_GROUP(id),{
        method:"DELETE",
        headers:getHeaders(token),
    })
    return response.json();
}

export const getGroupContacts = async (token,groupId) => {
    const response = await fetch (API_BASE_URL + ENDPOINTS. GET_GROUP_CONTACTS(groupId),{
        headers: getHeaders(token),
    })
    return response.json();
}

export const addContactsToGroup = async (token, groupId, contactIds) => {
  const response = await fetch(
    API_BASE_URL + ENDPOINTS.CONTACTS_ADD_TO_GROUP(groupId),
    {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({
        contactIds,
      }),
    }
  );
  return response.json();
};
export const bulkAddContactsToGroup = async (token, groupId, contactIds) => {
  const formData = new FormData();

  // This object must EXACTLY match backend DTO
  const groupRequest = {
    groupId: groupId,
    contactIds: contactIds,
  };

  formData.append(
    "groupRequest",
    new Blob([JSON.stringify(groupRequest)], {
      type: "application/json",
    })
  );

  const response = await fetch(
    API_BASE_URL + ENDPOINTS.BULK_ADD_CONTACTS_TO_GROUP,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ DO NOT set Content-Type
      },
      body: formData,
    }
  );

  return response.json();
};


