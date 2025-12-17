"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";


import SendTypeSelector from "@/components/send-sms/SendTypeSelector";

import IndividualSMS from "@/components/send-sms/IndividualSMS";

import GroupSMS from "@/components/send-sms/GroupSMS";

import BulkSMS from "@/components/send-sms/BulkSMS";

import MessageBox from "@/components/send-sms/MessageBox";
import Alert from "@/components/send-sms/Alert";

import { fetchGroups } from "@/lib/group";
import { fetchContacts } from "@/lib/contacts";
import { sendIndividualSMS, sendGroupSMS, sendBulkSMS } from "@/lib/sendsms";
import useAlert from "@/hooks/useAlert";

export default function SMSSendUI() {
  const [formData, setFormData] = useState({ message: "", sendType: "individual" });
  const [selectedGroup, setSelectedGroup] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [currentPhone, setCurrentPhone] = useState("");
  const [bulkFile, setBulkFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState("");
  const [bulkGroupName, setBulkGroupName] = useState("");
  const [sending, setSending] = useState(false);
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [token, setToken] = useState("");
  const [adminId, setAdminId] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("send-sms");

  const { alert, showAlert } = useAlert();

  useEffect(() => {
    const savedAdminId = localStorage.getItem("adminId");
    const savedToken = localStorage.getItem("token");
    if (savedAdminId) setAdminId(Number(savedAdminId));
    if (savedToken) setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    const loadData = async () => {
      try {
        const groupData = await fetchGroups(token);
        if (groupData.success) setGroups(groupData.data);
        const contactData = await fetchContacts(token);
        if (contactData.success) setContacts(contactData.data);
      } catch {
        showAlert("error", "Failed to load data");
      }
    };
    loadData();
  }, [token]);

  const handleSendSMS = async () => {
    if (formData.sendType !== "bulk" && !formData.message.trim()) return showAlert("error", "Please enter a message");
    if (formData.sendType === "individual" && phoneNumbers.length === 0) return showAlert("error", "Add at least one phone number");
    if (formData.sendType === "group" && !selectedGroup) return showAlert("error", "Select a group");
    if (formData.sendType === "bulk" && (!bulkFile || !bulkGroupName.trim())) return showAlert("error", "Select CSV and enter group name");

    setSending(true);
    try {
      let response;
      if (formData.sendType === "individual") response = await sendIndividualSMS(token, adminId, formData.message, phoneNumbers);
      else if (formData.sendType === "group") response = await sendGroupSMS(token, adminId, selectedGroup, formData.message);
      else if (formData.sendType === "bulk") response = await sendBulkSMS(token, adminId, bulkFile, bulkGroupName);

      if (response.success) {
        showAlert("success", formData.sendType === "bulk" ? "Bulk contacts uploaded!" : "SMS sent successfully!");
        setFormData({ ...formData, message: "" });
        setPhoneNumbers([]);
        setCurrentPhone("");
        setBulkFile(null);
        setSelectedFile("");
        setBulkGroupName("");
        setSelectedGroup("");
      } else throw new Error(response.message || "Failed to send");
    } catch (err) {
      showAlert("error", err.message || "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-30 bg-white shadow">
          <Header title="Send SMS" />
        </div>
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Alert type={alert?.type} message={alert?.message} onClose={() => showAlert(null)} />

            <SendTypeSelector sendType={formData.sendType} setSendType={(type) => setFormData({ ...formData, sendType: type })} />

            {formData.sendType === "individual" && (
              <IndividualSMS
                currentPhone={currentPhone}
                setCurrentPhone={setCurrentPhone}
                contacts={contacts}
                phoneNumbers={phoneNumbers}
                setPhoneNumbers={setPhoneNumbers}
                showAlert={showAlert}
              />
            )}

            {formData.sendType === "group" && <GroupSMS selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} groups={groups} />}

            {formData.sendType === "bulk" && (
              <BulkSMS
                bulkFile={bulkFile}
                setBulkFile={setBulkFile}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                bulkGroupName={bulkGroupName}
                setBulkGroupName={setBulkGroupName}
                showAlert={showAlert}
              />
            )}

            {formData.sendType !== "bulk" && (
              <MessageBox message={formData.message} setMessage={(msg) => setFormData({ ...formData, message: msg })} />
            )}

            <button
              onClick={handleSendSMS}
              disabled={sending}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {sending ? "Processing..." : formData.sendType === "bulk" ? "Upload Contacts to Group" : "Send SMS Now"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
