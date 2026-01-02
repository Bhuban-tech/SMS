"use client";

import React, { useEffect, useState, useCallback } from "react";

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
  sendTemplateSMS,
} from "@/lib/sendsms";

import { uploadGroupFile } from "@/lib/smsfiles";
import useAlert from "@/hooks/useAlert";

export default function SMSSendUI() {
  const [formData, setFormData] = useState({
    message: "",
    sendType: "individual",
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
  const [hasSubmitted, setHasSubmitted] = useState(false); // ← NEW: Track one-time click

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

  // Reset hasSubmitted when user changes important fields
  useEffect(() => {
    setHasSubmitted(false);
  }, [
    formData.message,
    formData.sendType,
    phoneNumbers,
    selectedGroup,
    bulkFile,
    bulkGroupName,
    templatePayload,
  ]);

  const handleSendSMS = useCallback(async () => {
    if (hasSubmitted || sending) return; // Prevent double click

    setHasSubmitted(true);
    setSending(true);

    try {
      let response;

      if (formData.sendType === "individual") {
        if (!formData.message.trim()) throw new Error("Enter a message");
        if (phoneNumbers.length === 0) throw new Error("Add phone numbers");

        response = await sendIndividualSMS(
          token,
          adminId,
          formData.message,
          phoneNumbers
        );
      }

      if (formData.sendType === "group") {
        if (!selectedGroup) throw new Error("Select a group");
        if (!formData.message.trim()) throw new Error("Enter a message");

        response = await sendGroupSMS(
          token,
          adminId,
          selectedGroup,
          formData.message
        );
      }

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

        showAlert("success", "Bulk contacts uploaded successfully!");
        setBulkFile(null);
        setBulkGroupName("");
        return;
      }

      if (formData.sendType === "template") {
        if (!templatePayload)
          throw new Error("Select template & recipients");

        const { content, csvData, selectedContacts, selectedGroup } = templatePayload;

        if (selectedContacts?.length > 0 || csvData?.length > 0) {
          response = await sendTemplateSMS(token, adminId, csvData || [], content);
        } else if (selectedGroup) {
          response = await sendGroupSMS(token, adminId, selectedGroup, content);
        } else {
          throw new Error("Select recipients or upload CSV");
        }
      }

      if (response && !response?.success)
        throw new Error(response?.message || "Failed to send");

      if (formData.sendType !== "bulk") {
        showAlert("success", "SMS sent successfully");
      }

      // Reset form (except sendType)
      setFormData({ message: "", sendType: formData.sendType });
      setPhoneNumbers([]);
      setCurrentPhone("");
      setSelectedGroup("");
      setTemplatePayload(null);
    } catch (err) {
      showAlert("error", err.message || "Error sending SMS");
      // Optional: Allow retry on error
      // setHasSubmitted(false);
    } finally {
      setSending(false);
    }
  }, [
    hasSubmitted,
    sending,
    formData,
    token,
    adminId,
    phoneNumbers,
    selectedGroup,
    bulkFile,
    bulkGroupName,
    templatePayload,
  ]);

  // Button disabled if processing OR already submitted
  const isSendDisabled = sending || hasSubmitted;

  const getButtonText = () => {
    if (sending) return "Processing...";
    if (hasSubmitted) {
      return formData.sendType === "bulk" ? "Uploaded" : "Sent";
    }
    return formData.sendType === "bulk" ? "Upload Contacts to Group" : "Send SMS";
  };

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

          {formData.sendType === "individual" && (
            <IndividualSMS
              currentPhone={currentPhone}
              setCurrentPhone={setCurrentPhone}
              contacts={contacts}
              phoneNumbers={phoneNumbers}
              setPhoneNumbers={setPhoneNumbers}
            />
          )}

          {formData.sendType === "group" && (
            <GroupSMS
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              groups={groups}
            />
          )}

          {formData.sendType === "bulk" && (
            <BulkSMS
              bulkFile={bulkFile}
              setBulkFile={setBulkFile}
              bulkGroupName={bulkGroupName}
              setBulkGroupName={setBulkGroupName}
            />
          )}

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

          {formData.sendType !== "template" && formData.sendType !== "bulk" && (
            <MessageBox
              message={formData.message}
              setMessage={(msg) =>
                setFormData({ ...formData, message: msg })
              }
            />
          )}

          <button
            onClick={handleSendSMS}
            disabled={isSendDisabled}
            className={`w-full py-4 rounded-xl mt-4 font-semibold transition ${
              isSendDisabled
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
          >
            {getButtonText()}
          </button>
        </main>
      </div>
    </div>
  );
}