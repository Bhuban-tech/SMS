import { API_BASE_URL, ENDPOINTS } from "@/config/api";

// Individual SMS
export const sendIndividualSMS = async (token, senderId, message, recipientNumbers) => {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SEND_MESSAGE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ senderId, content: message, recipientNumbers }),
  });
  return response.json();
};

// Group SMS
export const sendGroupSMS = async (token, senderId, groupId, message) => {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SEND_MESSAGE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ senderId, groupId, content: message }),
  });
  return response.json();
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
  return text ? JSON.parse(text) : { success: true };
};



export const createTemplate= async (token,templateData)=>{
  try{
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CREATE_TEMPLATE}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify(templateData)
    });
    return response.json();
      }catch(error){
        return {success:false,message:error.message};
      }
};

// export const getTemplateSMS = async(token) =>{
//   try{
//     const response = await fetch (`${API_BASE_URL}${ENDPOINTS.GET_TEMPLATES}`,{
//       method:"GET",
//       headers:{
//         "Content-Type":"application/json",
//         Authorization:`Bearer ${token}`
//       },

//     });
//     return response.json();
//   }catch(error){
//     return{success:false,message:error.message}
//   }
// };

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
        message: errorText || "Forbidden"
      };
    }

    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};


export const getTemplateByName = async (token,name) => {
  try{
    const response = await fetch (`${API_BASE_URL}${ENDPOINTS.GET_TEMPLATE(name)}`,{
      method:"GET",
      headers:{
       
        Authorization:`Bearer ${token}`
      }
    });
    return response.json();
  }catch(error){
    return{success:false, message:error.message}
  }
}

export const updateTemplate = async(token, id, updateData) => {
  try{
    const response = await fetch (`${API_BASE_URL}${ENDPOINTS.UPDATE_TEMPLATE(id)}`,{
      method:"PUT",
      headers:{
         "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify(updateData)
    });
    return response.json();
  }catch(error){
    return{success:false, message:error.message}
  }
}

export const deleteTemplate = async (token,id) =>{
  try{
    const response = await fetch (`${API_BASE_URL}${ENDPOINTS.DELETE_TEMPLATE(id)}`,{
      method:"DELETE",
       headers:{
         
        Authorization:`Bearer ${token}`
      },
    });
    return response.json();
  }catch(error){
    return{success:false,message:error.message}
  }
}


export const sendTemplateSMS = async (token, adminId, csvData, content) => {
  const res = await fetch(`${API_BASE_URL}${ENDPOINTS.SEND_MESSAGE}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      senderId: adminId,
      content,      
      contacts: csvData
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to send template SMS");
  }

  return await res.json();
};
