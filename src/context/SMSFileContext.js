"use client";

import { createContext, useContext, useState } from "react";

const SMSFilesContext = createContext();

export function SMSFilesProvider({ children }) {
  const [smsFiles, setSmsFiles] = useState([]); // stores all SMS files

  return (
    <SMSFilesContext.Provider value={{ smsFiles, setSmsFiles }}>
      {children}
    </SMSFilesContext.Provider>
  );
}

// Custom hook to access the context
export function useSMSFiles() {
  const context = useContext(SMSFilesContext);
  if (!context) throw new Error("useSMSFiles must be used within SMSFilesProvider");
  return context;
}
