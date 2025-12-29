// src/components/send-sms/TemplateSelector.jsx
"use client";

import React, { useState } from "react";

const TemplateSelector = ({ selectedTemplate, setSelectedTemplate }) => {
  const templates = [
    { id: 1, name: "Welcome Message" },
    { id: 2, name: "Promotion Offer" },
    { id: 3, name: "Birthday Greeting" },
  ];

  return (
    <select
      className="w-full p-2 border rounded-md"
      value={selectedTemplate || ""}
      onChange={(e) => setSelectedTemplate(e.target.value)}
    >
      <option value="">Select a template</option>
      {templates.map((t) => (
        <option key={t.id} value={t.name}>
          {t.name}
        </option>
      ))}
    </select>
  );
};

export default TemplateSelector;
