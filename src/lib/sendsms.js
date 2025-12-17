import { API_BASE_URL, ENDPOINTS } from "@/config/api"

export const sendIndividualSMS = async(token, senderId, message, recipientNumbers) => {
    const response = await fetch (`${API_BASE_URL}${ENDPOINTS.SEND_MESSAGE}`,{
        method:"POST",
        headers:{"Content-type":"application/json",Authoriztion: `Bearer ${token}`},
        body: JSON.stringify({senderId,content:message, recipientNumbers}),
    });

    return response.json();
}

export const sendGroupSMS = async (token,senderId, groupId,message) => {
    const response = await fetch (`${API_BASE_URL}$ENDPOINTS.SEND_MESSAGE}`,{
        method: "POST",
        headers: {"Content-type":"application/json", Authoriztion: `Bearer ${token}`},
        body: JSON.stringify({senderId, groupId, content: message})
    });
    return response.json();
}

export const sendBulkSMS = async (token, senderId, groupName, file) => {
    const form = new FormData(); 
    form.append("file", file);
    form.append ("groupRequest",
            new Blob([JSON.stringify({ name: bulkGroupName.trim(), senderId: adminId })], { type: "application/json" })
    );
    
    const response = await fetch (`${API_BASE_URL}${ENDPOINTS.BULK_ADD_CONTACTS_TO_GROUP("new")}`,{
        method: "POST",
        headers: {Authoriztion: `Bearer ${token}`},
        body: form,
    });
    return response.json();
}

