"use client"

import { useEffect } from "react";
import Profile from "@/app/profile/page"; 

export default function ProfileModal({ open, onClose }) {
  if (!open) return null;


  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">

      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />


      <div className="relative w-full max-w-2xl   bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <Profile isModal={true} onClose={onClose} />
      </div>
    </div>
  );
}