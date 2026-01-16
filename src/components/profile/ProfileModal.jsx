// ProfileModal.jsx
'use client';

import { useEffect } from "react";
import Profile from "@/app/profile/page";

export default function ProfileModal({ open, onClose }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 bg-black/50 "
        onClick={onClose}
      />

      <div className="
        relative w-full max-w-lg sm:max-w-xl md:max-w-2xl 
        bg-white rounded-2xl shadow-2xl overflow-hidden 
        max-h-[92vh] sm:max-h-[90vh] 
        animate-in fade-in zoom-in-95 duration-200
      ">
        <Profile isModal={true} onClose={onClose} />
      </div>
    </div>
  );
}
