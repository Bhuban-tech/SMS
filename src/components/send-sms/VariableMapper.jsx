// src/components/send-sms/VariableMapper.jsx
"use client";

import React, { useState, useEffect } from "react";

const VariableMapper = ({ mappedVariables, setMappedVariables }) => {
  const templateVariables = ["{{name}}", "{{date}}", "{{discount}}"];

  const handleChange = (variable, value) => {
    setMappedVariables({ ...mappedVariables, [variable]: value });
  };

  return (
    <div className="space-y-3">
      {templateVariables.map((variable) => (
        <div key={variable} className="flex flex-col">
          <label className="text-sm font-medium mb-1">{variable}</label>
          <input
            type="text"
            placeholder={`Value for ${variable}`}
            value={mappedVariables[variable] || ""}
            onChange={(e) => handleChange(variable, e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
      ))}
    </div>
  );
};

export default VariableMapper;
