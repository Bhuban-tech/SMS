"use client";

import React, { useEffect, useState } from "react";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SendTypeSelector from "@/components/send-sms/SendTypeSelector";
import IndividualSMS from "@/components/send-sms/IndividualSMS";
import GroupSMS from "@/components/send-sms/GroupSMS";
import BulkSMS from "@/components/send-sms/BulkSMS";
import MessageBox from "@/components/send-sms/MessageBox";
import Alert from "@/components/send-sms/Alert";
import TemplateSMS from "@/components/send-sms/TemplateSMS";

import { fetchGroups } from "@/lib/group";
import { fetchContacts } from "@/lib/contacts";
import {
  sendIndividualSMS,
  sendGroupSMS,
  sendBulkSMS,
  sendTemplateSMS
} from "@/lib/sendsms";

import { uploadGroupFile } from "@/lib/smsfiles"; // ✅ Bulk file upload helper
import useAlert from "@/hooks/useAlert";

export default function SMSSendUI() {
  const [formData, setFormData] = useState({
    message: "",
    sendType: "individual"
  });

  const [token, setToken] = useState("");
  const [adminId, setAdminId] = useState(0);

  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [currentPhone, setCurrentPhone] = useState("");

  const [bulkFile, setBulkFile] = useState(null);
  const [bulkGroupName, setBulkGroupName] = useState("");

  const [sending, setSending] = useState(false);

  const [templatePayload, setTemplatePayload] = useState(null);

  const { alert, showAlert } = useAlert();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("send-sms");

  /** Load token & adminId */
  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
    setAdminId(Number(localStorage.getItem("adminId")) || 0);
  }, []);

  /** Load contacts and groups */
  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const g = await fetchGroups(token);
        if (g.success) setGroups(g.data);

        const c = await fetchContacts(token);
        if (c.success) setContacts(c.data);
      } catch {
        showAlert("error", "Failed to load data");
      }
    })();
  }, [token]);

  /** ================= SEND SMS HANDLER ================= */
  const handleSendSMS = async () => {
    setSending(true);

    try {
      let response;

      /** ---------- Individual ---------- */
      if (formData.sendType === "individual") {
        if (!formData.message.trim())
          throw new Error("Enter a message");
        if (phoneNumbers.length === 0)
          throw new Error("Add phone numbers");

        response = await sendIndividualSMS(
          token,
          adminId,
          formData.message,
          phoneNumbers
        );
      }

      /** ---------- Group ---------- */
      if (formData.sendType === "group") {
        if (!selectedGroup)
          throw new Error("Select a group");
        if (!formData.message.trim())
          throw new Error("Enter a message");

        response = await sendGroupSMS(
          token,
          adminId,
          selectedGroup,
          formData.message
        );
      }

      /** ---------- Bulk ---------- */
      if (formData.sendType === "bulk") {
        if (!bulkFile || !bulkGroupName)
          throw new Error("Select file & group name");

        const uploadRes = await uploadGroupFile(
          token,
          adminId,
          bulkFile,
          bulkGroupName
        );

        if (!uploadRes?.success)
          throw new Error("Failed to upload bulk file");

        showAlert(
          "success",
          "Bulk contacts uploaded and added to group successfully!"
        );

        setBulkFile(null);
        setBulkGroupName("");
        return;
      }

      /** ---------- Template ---------- */
      if (formData.sendType === "template") {
        if (!templatePayload)
          throw new Error("Select template & CSV if needed");

        const { content, csvData, selectedContacts, selectedGroup } = templatePayload;

        // Individual template send
        if (selectedContacts?.length > 0) {
          response = await sendTemplateSMS(token, adminId, csvData, content);
        }
        // Group template send
        else if (selectedGroup) {
          response = await sendGroupSMS(token, adminId, selectedGroup, content);
        }
        // Bulk template send (CSV only)
        else if (csvData?.length > 0) {
          response = await sendTemplateSMS(token, adminId, csvData, content);
        }
        else {
          throw new Error(
            "Select individual contacts, a group, or upload CSV to send template SMS"
          );
        }
      }

      if (!response?.success)
        throw new Error(response?.message || "Failed to send");

      showAlert("success", "SMS sent successfully");

      /** ---------- RESET ---------- */
      setFormData({ message: "", sendType: formData.sendType });
      setPhoneNumbers([]);
      setCurrentPhone("");
      setBulkFile(null);
      setBulkGroupName("");
      setSelectedGroup("");
      setTemplatePayload(null);
    } catch (err) {
      showAlert("error", err.message || "Error sending SMS");
    } finally {
      setSending(false);
    }
  };

  /** ================= Render UI ================= */
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col">
        <Header title="Send SMS" />

        <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
          <Alert {...alert} onClose={() => showAlert(null)} />

          <SendTypeSelector
            sendType={formData.sendType}
            setSendType={(type) =>
              setFormData({ ...formData, sendType: type })
            }
          />

          {/* Individual */}
          {formData.sendType === "individual" && (
            <IndividualSMS
              currentPhone={currentPhone}
              setCurrentPhone={setCurrentPhone}
              contacts={contacts}
              phoneNumbers={phoneNumbers}
              setPhoneNumbers={setPhoneNumbers}
            />
          )}

          {/* Group */}
          {formData.sendType === "group" && (
            <GroupSMS
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              groups={groups}
            />
          )}

          {/* Bulk */}
          {formData.sendType === "bulk" && (
            <BulkSMS
              bulkFile={bulkFile}
              setBulkFile={setBulkFile}
              bulkGroupName={bulkGroupName}
              setBulkGroupName={setBulkGroupName}
            />
          )}

          {/* Template */}
          {formData.sendType === "template" && (
            <TemplateSMS
              bulkFile={bulkFile}
              setBulkFile={setBulkFile}
              bulkGroupName={bulkGroupName}
              setBulkGroupName={setBulkGroupName}
              setTemplatePayload={setTemplatePayload}
              contacts={contacts}
              groups={groups}
              selectedContacts={phoneNumbers}
              setSelectedContacts={setPhoneNumbers}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
            />
          )}

          {/* MessageBox for manual SMS (not template/bulk) */}
          {formData.sendType !== "template" &&
           formData.sendType !== "bulk" && (
            <MessageBox
              message={formData.message}
              setMessage={(msg) =>
                setFormData({ ...formData, message: msg })
              }
            />
          )}

          {/* Send Button */}
          <button
            onClick={handleSendSMS}
            disabled={sending}
            className="w-full bg-teal-600 text-white py-4 rounded-xl mt-4 hover:bg-teal-700 disabled:opacity-50 transition hover:cursor-pointer"
          >
            {sending
              ? "Processing..."
              : formData.sendType === "bulk"
              ? "Upload Contacts to Group"
              : "Send SMS"}
          </button>
        </main>
      </div>
    </div>
  );
}
