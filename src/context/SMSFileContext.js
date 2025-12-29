"use client";
import React, { createContext, useContext, useState } from "react";

const SMSFilesContext = createContext(null);

export function SMSFilesProvider({ children }) {
  const [smsFiles, setSmsFiles] = useState([]);

  return (
    <SMSFilesContext.Provider value={{ smsFiles, setSmsFiles }}>
      {children}
    </SMSFilesContext.Provider>
  );
}

export function useSMSFiles() {
  const context = useContext(SMSFilesContext);
  if (!context) {
    throw new Error("useSMSFiles must be used within SMSFilesProvider");
  }
  return context;
}
