"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { toast } from "sonner";

import GroupHeader from "@/components/groups/GroupHeader";
import GroupTable from "@/components/groups/GroupTable";
import GroupViewModal from "@/components/groups/GroupViewModal";
import GroupAddContactModal from "@/components/groups/GroupAddContactModal";
import GroupModal from "@/components/groups/GroupModal";
import { Menu,X } from "lucide-react";

import {
  fetchGroups,
  deleteGroup,
  updateGroup,         
  getGroupContacts,
  removeContactFromGroup,
} from "@/lib/group";

export default function GroupPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("groups");

  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");

  const [editingGroupId, setEditingGroupId] = useState(null);

  const [groupToDelete, setGroupToDelete] = useState(null);
  

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupContacts, setGroupContacts] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const [contactToRemove, setContactToRemove] = useState(null);
  const [showRemoveContactModal, setShowRemoveContactModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);


  // Load token
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  // Load groups
  useEffect(() => {
    if (token) loadGroups();
  }, [token]);

  const loadGroups = async () => {
    try {
      const res = await fetchGroups(token);
      if (!res.success) return toast.error(res.message);
      setGroups(res.data);
    } catch {
      toast.error("Failed to load groups");
    }
  };

  
  const handleEditGroupName = async (groupId, newName) => {
    if (!newName.trim()) return;

   
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, name: newName } : g))
    );
    setEditingGroupId(null);

    
    try {
      const res = await updateGroup(token, groupId, newName);
      if (!res.success) {
        toast.error(res.message || "Failed to update group");
       
        loadGroups();
      } else {
        toast.success("Group name updated successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update group");
      loadGroups(); 
    }
  };

  const handleViewContacts = async (group) => {
    setSelectedGroup(group);
    setShowViewModal(true);
    const res = await getGroupContacts(token, group.id);
    if (res.success) setGroupContacts(res.data.contacts);
  };

  const handleDelete = async () => {
    if (!groupToDelete) return;
    try {
      const res = await deleteGroup(token, groupToDelete.id);
      if (res.success) {
        toast.success("Group deleted successfully");
        setGroups(groups.filter((g) => g.id !== groupToDelete.id));
      } else {
        toast.error(res.message || "Failed to delete group");
      }
    } catch {
      toast.error("Failed to delete group");
    } finally {
      setGroupToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleRemoveContact = (groupId, contact) => {
     setShowViewModal(false);
    setContactToRemove({ groupId, contact });
    setShowRemoveContactModal(true);
  };

  const confirmRemoveContact = async () => {
    if (!contactToRemove) return;

    const { groupId, contact } = contactToRemove;
    try {
      const res = await removeContactFromGroup(token, groupId, contact.id);
      if (res.success) {
  setGroupContacts((prev) => {
    const updated = prev.filter((c) => c.id !== contact.id);

    setGroups((groupsPrev) =>
      groupsPrev.map((g) =>
        g.id === groupId
          ? { ...g, contactCount: updated.length }
          : g
      )
    );

    setSelectedGroup((g) =>
      g && g.id === groupId
        ? { ...g, contactCount: updated.length }
        : g
    );

    return updated;
  });

  toast.success("Contact removed successfully");
}else {
        toast.error(res.message || "Failed to remove contact");
      }
    } catch {
      toast.error("Error removing contact");
    } finally {
      setShowRemoveContactModal(false);
      setContactToRemove(null);
    }
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
        <button
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-800 transition"
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-30 bg-gray-50 shadow">
          <Header title="Group Contacts" />
        </div>

        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
          {/* <GroupHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
          <GroupHeader
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  openGroupModal={() => setShowGroupModal(true)}
/>

{/* 
          <GroupTable
            groups={filteredGroups}
            onDelete={(g) => setGroupToDelete(g)}
            onViewContacts={handleViewContacts}
            onAddContact={(g) => {
              setSelectedGroup(g);
              setShowAddContactModal(true);
            }}
            editingGroupId={editingGroupId}
            setEditingGroupId={setEditingGroupId}
            onEditGroupName={handleEditGroupName}
          /> */}
          <GroupTable
  groups={filteredGroups}
  onDelete={(g) => {
    setGroupToDelete(g);
    setShowDeleteModal(true);
  }}
  onViewContacts={handleViewContacts}
  onAddContact={(g) => {
    setSelectedGroup(g);
    setShowAddContactModal(true);
  }}
  editingGroupId={editingGroupId}
  setEditingGroupId={setEditingGroupId}
  onEditGroupName={handleEditGroupName}
/>
        </main>
      </div>

     
      {showViewModal && selectedGroup && (
        <GroupViewModal
          group={selectedGroup}
          contacts={groupContacts}
          onClose={() => setShowViewModal(false)}
          onRemoveContact={handleRemoveContact}
        />
      )}

      {showAddContactModal && selectedGroup && (
        <GroupAddContactModal
          token={token}
          group={selectedGroup}
          onClose={() => setShowAddContactModal(false)}
          onSuccess={loadGroups}
        />
      )}
{showRemoveContactModal && contactToRemove && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-2">
    <div className="relative bg-white rounded-xl p-4 w-full max-w-md shadow-lg">
      
      {/* Close button */}
      <button
        aria-label="Close"
        onClick={() => setShowRemoveContactModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold mb-4 text-center">
        Remove Contact
      </h2>

      <p>
        Are you sure you want to remove{" "}
        <strong>{contactToRemove.contact.name}</strong> from this group?
      </p>

      <div className="mt-6 flex justify-center gap-2 flex-wrap">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 hover:cursor-pointer"
          onClick={() => setShowRemoveContactModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 hover:cursor-pointer"
          onClick={confirmRemoveContact}
        >
          Remove
        </button>
      </div>
    </div>
  </div>
)}

{showDeleteModal && groupToDelete && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
    <div className="relative bg-gray-100 rounded-xl p-4 w-full max-w-md shadow-lg">
      
      {/* Close button */}
      <button
        aria-label="Close"
        onClick={() => setShowDeleteModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold mb-4 text-center">
        Delete Group
      </h2>

      <p className="p-5 mx-10 text-center">
        Are you sure you want to delete "{groupToDelete.name}"?
      </p>

      <div className="mt-6 flex justify-center gap-2 flex-wrap">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 hover:cursor-pointer"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 hover:cursor-pointer"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

      {showGroupModal && (
  <GroupModal
    token={token}
    onClose={() => setShowGroupModal(false)}
    onSuccess={loadGroups}
  />
)}

    </div>
  );
}
