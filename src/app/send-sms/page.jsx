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
import { X, Menu } from "lucide-react";

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
import { toast } from "sonner";

export default function SMSSendUI() {
  const [formData, setFormData] = useState({
    message: "",
    sendType: "individual",
  });

  const [token, setToken] = useState("");
  const senderId = 1; // ← STATIC SENDER ID

  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [currentPhone, setCurrentPhone] = useState("");

  const [bulkFile, setBulkFile] = useState(null);
  const [bulkGroupName, setBulkGroupName] = useState("");

  const [sending, setSending] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [templatePayload, setTemplatePayload] = useState(null);

  const { alert, showAlert } = useAlert();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("send-sms");

  /** Load token */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    
    if (storedToken) {
      setToken(storedToken);
      console.log("✅ Token loaded, using static senderId:", senderId);
    } else {
      console.error("❌ No token found in localStorage");
    }
  }, []);

  /** Load contacts and groups */
  useEffect(() => {
    if (!token) {
      console.log("⏳ Waiting for token...");
      return;
    }

    (async () => {
      try {
        const g = await fetchGroups(token);
        if (g.success) setGroups(g.data);

        const c = await fetchContacts(token);
        if (c.success) setContacts(c.data);
      } catch (error) {
        console.error("Failed to load data:", error);
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
    if (hasSubmitted || sending) return;
    
    console.log("📤 Sending SMS with static senderId:", senderId);

    setHasSubmitted(true);
    setSending(true);

    try {
      let response;

      if (formData.sendType === "individual") {
        if (!formData.message.trim()) throw new Error("Enter a message");
        if (phoneNumbers.length === 0) throw new Error("Add phone numbers");

        console.log("Sending individual SMS:", { senderId, phoneNumbers });
        response = await sendIndividualSMS(
          token,
          senderId,
          formData.message,
          phoneNumbers
        );
      }

      if (formData.sendType === "group") {
        if (!selectedGroup) throw new Error("Select a group");
        if (!formData.message.trim()) throw new Error("Enter a message");

        console.log("Sending group SMS:", { senderId, selectedGroup });
        response = await sendGroupSMS(
          token,
          senderId,
          selectedGroup,
          formData.message
        );
      }

      if (formData.sendType === "bulk") {
        if (!bulkFile || !bulkGroupName)
          throw new Error("Select file & group name");

        console.log("Uploading bulk file:", { senderId, bulkGroupName });
        const uploadRes = await uploadGroupFile(
          token,
          senderId,
          bulkFile,
          bulkGroupName
        );

        if (!uploadRes?.success)
          throw new Error("Failed to upload bulk file");

        toast.success("Bulk contacts uploaded successfully!");
        setBulkFile(null);
        setBulkGroupName("");
        return;
      }

      if (formData.sendType === "template") {
        if (!templatePayload)
          throw new Error("Select template & recipients");

        const { content, csvData, selectedContacts, selectedGroup } = templatePayload;

        console.log("Sending template SMS:", { senderId, csvData, selectedGroup });
        if (selectedContacts?.length > 0 || csvData?.length > 0) {
          response = await sendTemplateSMS(token, senderId, csvData || [], content);
        } else if (selectedGroup) {
          response = await sendGroupSMS(token, senderId, selectedGroup, content);
        } else {
          throw new Error("Select recipients or upload CSV");
        }
      }

      console.log("📥 Response:", response);

      if (response && !response?.success)
        throw new Error(response?.message || "Failed to send");

      if (formData.sendType !== "bulk") {
        toast.success("SMS sent successfully!");
      }

      // Reset form (except sendType)
      setFormData({ message: "", sendType: formData.sendType });
      setPhoneNumbers([]);
      setCurrentPhone("");
      setSelectedGroup("");
      setTemplatePayload(null);
    } catch (err) {
      console.error("❌ Error sending SMS:", err);
      toast.error(err.message || "Error sending SMS");
      setHasSubmitted(false); // Allow retry on error
    } finally {
      setSending(false);
    }
  }, [
    hasSubmitted,
    sending,
    formData,
    token,
    senderId,
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
                : "bg-teal-600 text-white hover:bg-teal-700 hover:cursor-pointer"
            }`}
          >
            {getButtonText()}
          </button>
        </main>
      </div>
    </div>
  );
}