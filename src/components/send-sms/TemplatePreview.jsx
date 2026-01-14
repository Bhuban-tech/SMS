"use client";

import React from "react";

const TemplatePreview = ({ mappedVariables, templateText }) => {
  if (!templateText) return null;

  let preview = templateText;
  Object.keys(mappedVariables || {}).forEach((key) => {
    preview = preview.replace(new RegExp(`{{${key}}}`, "g"), mappedVariables[key]);
  });

  return (
    <div className="p-4 border border-gray-300 rounded-md bg-gray-50 min-h-20">
      <p>{preview}</p>
    </div>
  );
};

export default TemplatePreview;
