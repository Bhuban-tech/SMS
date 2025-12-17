import { API_BASE_URL } from "@/config/api";

// Fetch all groups/files
export const fetchGroups = async (token) => {
  if (!token) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/groups/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch groups");
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (err) {
    throw err;
  }
};

// Upload a bulk file
export const uploadGroupFile = async (token, adminId, file, groupName) => {
  const formData = new FormData();
  formData.append("file", file);
  const groupRequest = { name: groupName.trim(), senderId: adminId };
  formData.append(
    "groupRequest",
    new Blob([JSON.stringify(groupRequest)], { type: "application/json" })
  );

  try {
    const res = await fetch(`${API_BASE_URL}/api/groups/contacts/bulk`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Upload failed");
    return result;
  } catch (err) {
    throw err;
  }
};

// Update group/file details
export const updateGroup = async (token, fileId, newFile) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/groups/update/${fileId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(newFile),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to update group");
    return result;
  } catch (err) {
    throw err;
  }
};

// Delete group/file
export const deleteGroup = async (token, fileId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/groups/delete/${fileId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete group");
    }
    return true;
  } catch (err) {
    throw err;
  }
};
