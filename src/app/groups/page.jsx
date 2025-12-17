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
    try {
      const res = await deleteGroup(token, groupToDelete.id);
      if (!res.success) return toast.error(res.message);
      toast.success("Group deleted");
      loadGroups();
    } finally {
      setGroupToDelete(null);
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
        {/* <Header /> */}

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
            onDelete={setGroupToDelete}
            onView={handleViewContacts}
            onAddContact={(g) => {
              setSelectedGroup(g);
              setShowAddContactModal(true);
            }}
          />
        </main>
      </div>

      {showGroupModal && (
        <GroupModal
          token={token}
          group={editingGroup}
          onClose={() => setShowGroupModal(false)}
          onSuccess={loadGroups}
        />
      )}

      {showViewModal && (
        <GroupViewModal
          group={selectedGroup}
          contacts={groupContacts}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showAddContactModal && (
        <GroupAddContactModal
          token={token}
          group={selectedGroup}
          onClose={() => setShowAddContactModal(false)}
          onSuccess={loadGroups}
        />
      )}
    </div>
  );
}
