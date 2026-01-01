"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { toast } from "sonner";

import GroupHeader from "@/components/groups/GroupHeader";
import GroupTable from "@/components/groups/GroupTable";
import GroupModal from "@/components/groups/GroupModal";
import GroupViewModal from "@/components/groups/GroupViewModal";
import GroupAddContactModal from "@/components/groups/GroupAddContactModal";

import {
  fetchGroups,
  deleteGroup,
  getGroupContacts,
} from "@/lib/group";

export default function GroupPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("groups");

  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState("");

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [groupContacts, setGroupContacts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const [groupToDelete, setGroupToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // <-- Add state for delete confirmation

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (token) loadGroups();
  }, [token]);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const res = await fetchGroups(token);
      if (!res.success) return toast.error(res.message);
      setGroups(res.data);
    } catch {
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!groupToDelete) return;
    try {
      const res = await deleteGroup(token, groupToDelete.id);
      if (!res.success) return toast.error(res.message);
      toast.success("Group deleted");
      loadGroups();
    } catch {
      toast.error("Failed to delete group");
    } finally {
      setGroupToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleViewContacts = async (group) => {
    setSelectedGroup(group);
    setShowViewModal(true);
    const res = await getGroupContacts(token, group.id);
    if (res.success) setGroupContacts(res.data.contacts);
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
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

        <main className="flex-1 overflow-auto p-6 space-y-6">
          <GroupHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            openGroupModal={() => {
              setEditingGroup(null);
              setShowGroupModal(true);
            }}
          />

          <GroupTable
            groups={filteredGroups}
            onEdit={(g) => {
              setEditingGroup(g);
              setShowGroupModal(true);
            }}
            onDelete={(g) => {
              setGroupToDelete(g);
              setShowDeleteModal(true); // <-- Open delete confirmation
            }}
            onViewContacts={handleViewContacts}
            onAddContact={(g) => {
              setSelectedGroup(g);
              setShowAddContactModal(true);
            }}
          />
        </main>
      </div>

      {/* Group Modal */}
      {showGroupModal && (
        <GroupModal
          token={token}
          group={editingGroup}
          onClose={() => setShowGroupModal(false)}
          onSuccess={loadGroups}
        />
      )}

      {/* View Contacts Modal */}
      {showViewModal && (
        <GroupViewModal
          group={selectedGroup}
          contacts={groupContacts}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <GroupAddContactModal
          token={token}
          group={selectedGroup}
          onClose={() => setShowAddContactModal(false)}
          onSuccess={loadGroups}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && groupToDelete && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Delete Group</h2>
            <p>Are you sure you want to delete "{groupToDelete.name}"?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
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
