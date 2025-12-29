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

import { useSMSFiles } from "@/context/SMSFileContext";
import { fetchGroups } from "@/lib/group";
import { fetchContacts } from "@/lib/contacts";
import {
  sendIndividualSMS,
  sendGroupSMS,
  sendBulkSMS,
  sendTemplateSMS
} from "@/lib/sendsms";

import useAlert from "@/hooks/useAlert";
import TemplateSMS from "@/components/send-sms/TemplateSMS";

export default function SMSSendUI() {
  const [formData, setFormData] = useState({
    message: "",
    sendType: "individual",
  });

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

  const { smsFiles, setSmsFiles } = useSMSFiles();
  const { alert, showAlert } = useAlert();

  const [templatePayload, setTemplatePayload] = useState(null);

  // Load token
  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
    setAdminId(Number(localStorage.getItem("adminId")) || 0);
  }, []);

  // Load groups & contacts
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

 
  const handleSendSMS = async () => {
 
    if (
      formData.sendType !== "bulk" &&
      formData.sendType !== "template" &&
      !formData.message.trim()
    ) {
      return showAlert("error", "Enter a message");
    }

    if (formData.sendType === "individual" && phoneNumbers.length === 0) {
      return showAlert("error", "Add phone number");
    }

    if (formData.sendType === "group" && !selectedGroup) {
      return showAlert("error", "Select group");
    }

    if (
      formData.sendType === "template" &&
      (!templatePayload || templatePayload.messages.length === 0)
    ) {
      return showAlert("error", "Select template and upload CSV");
    }

    const finalBulkGroupName =
      typeof bulkGroupName === "string"
        ? bulkGroupName.trim()
        : bulkGroupName?.name?.trim();

    if (formData.sendType === "bulk" && (!bulkFile || !finalBulkGroupName)) {
      return showAlert("error", "Select file & group name");
    }

    setSending(true);

    try {
      let response;

   
      if (formData.sendType === "individual") {
        response = await sendIndividualSMS(
          token,
          adminId,
          formData.message,
          phoneNumbers
        );
      }

     
      if (formData.sendType === "group") {
        response = await sendGroupSMS(
          token,
          adminId,
          selectedGroup,
          formData.message
        );
      }

   
      if (formData.sendType === "bulk") {
        response = await sendBulkSMS(
          token,
          adminId,
          bulkFile,
          finalBulkGroupName
        );

        if (response?.success) {
          const newFile = {
            id: response.id || Date.now(),
            fileName: bulkFile.name,
            fileType: bulkFile.name.split(".").pop(),
            size: bulkFile.size,
            name: finalBulkGroupName,
            createdAt: new Date().toISOString(),
            author: "admin",
          };

          setSmsFiles((prev) => [newFile, ...prev]);
        }
      }


//      if (formData.sendType === "template") {
//   response = await sendTemplateSMS(
//     token,
//     adminId,
//     templatePayload.messages
//   );
// }
      if (formData.sendType === "template") {
  if (!bulkFile || !bulkGroupName) {
    return showAlert("error", "Select file & group name");
  }

  response = await sendTemplateSMS(token, adminId, bulkFile, bulkGroupName);

  if (!response.success) throw new Error("Failed to send template messages");

  showAlert("success", "Template SMS uploaded successfully!");
}



      if (!response?.success) throw new Error("Failed");

      showAlert(
        "success",
        formData.sendType === "bulk"
          ? "Contacts uploaded successfully!"
          : formData.sendType === "template"
          ? "Template SMS sent successfully!"
          : "SMS sent!"
      );


      setFormData({ message: "", sendType: formData.sendType });
      setPhoneNumbers([]);
      setCurrentPhone("");
      setBulkFile(null);
      setSelectedFile("");
      setBulkGroupName("");
      setSelectedGroup("");
    } catch (err) {
      showAlert("error", err.message || "Error");
    } finally {
      setSending(false);
    }
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

        <main className="p-6 max-w-4xl mx-auto w-full">
          <Alert
            type={alert?.type}
            message={alert?.message}
            onClose={() => showAlert(null)}
          />

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
              showAlert={showAlert}
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
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              bulkGroupName={bulkGroupName}
              setBulkGroupName={setBulkGroupName}
              showAlert={showAlert}
            />
          )}

          {/* {formData.sendType === "template" && (
            <TemplateSMS setTemplatePayload={setTemplatePayload} />
          )} */}

          {formData.sendType === "template" && (
  <TemplateSMS
    bulkFile={bulkFile}
    setBulkFile={setBulkFile}
    bulkGroupName={bulkGroupName}
    setBulkGroupName={setBulkGroupName}
    showAlert={showAlert}
  />
)}


          {formData.sendType !== "bulk" &&
            formData.sendType !== "template" && (
              <MessageBox
                message={formData.message}
                setMessage={(msg) =>
                  setFormData({ ...formData, message: msg })
                }
              />
            )}

          <button
            onClick={handleSendSMS}
            disabled={sending}
            className="w-full bg-teal-600 text-white py-4 rounded-xl mt-4"
          >
            {sending
              ? "Processing..."
              : formData.sendType === "bulk"
              ? "Upload Contacts"
              : formData.sendType === "template"
              ? "Send Template SMS"
              : "Send SMS"}
          </button>
        </main>
      </div>
    </div>
  );
}
