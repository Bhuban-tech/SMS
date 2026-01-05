"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { toast } from "sonner";

import GroupHeader from "@/components/groups/GroupHeader";
import GroupTable from "@/components/groups/GroupTable";
import GroupViewModal from "@/components/groups/GroupViewModal";
import GroupAddContactModal from "@/components/groups/GroupAddContactModal";

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

  // Inline edit save
  const handleEditGroupName = async (groupId, newName) => {
    if (!newName.trim()) return;

    // Optimistic update: update locally first
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, name: newName } : g))
    );
    setEditingGroupId(null);

    // Call API to persist change
    try {
      const res = await updateGroup(token, groupId, newName);
      if (!res.success) {
        toast.error(res.message || "Failed to update group");
        // rollback local change if API fails
        loadGroups();
      } else {
        toast.success("Group name updated");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update group");
      loadGroups(); // rollback
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
        toast.success("Group deleted");
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
    setContactToRemove({ groupId, contact });
    setShowRemoveContactModal(true);
  };

  const confirmRemoveContact = async () => {
    if (!contactToRemove) return;

    const { groupId, contact } = contactToRemove;
    try {
      const res = await removeContactFromGroup(token, groupId, contact.id);
      if (res.success) {
        setGroupContacts((prev) => prev.filter((c) => c.id !== contact.id));
        toast.success("Contact removed");
      } else {
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
          <GroupHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

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
          />
        </main>
      </div>

      {/* Modals */}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Remove Contact</h2>
            <p>
              Are you sure you want to remove{" "}
              <strong>{contactToRemove.contact.name}</strong> from this group?
            </p>
            <div className="mt-6 flex justify-end gap-2 flex-wrap">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowRemoveContactModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
          <div className="bg-gray-100 rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Group</h2>
            <p>Are you sure you want to delete "{groupToDelete.name}"?</p>
            <div className="mt-6 flex justify-end gap-2 flex-wrap">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
