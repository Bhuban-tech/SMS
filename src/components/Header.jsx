'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Users, LogOut, User } from "lucide-react";
import ProfileModal from "./profile/ProfileModal";

const Header = ({
  collegeName = "Aadim National College",
  balance = 5000,
  avatarIcon = <Users size={20} className="w-6 h-6 sm:w-8 sm:h-8 bg-teal-500 rounded-full flex items-center justify-center shrink-0" />,
  bgColor = "bg-white",
  title 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setProfileOpen(true);
    setDropdownOpen(false);
  };


  const handleLogout = () => {
  // 1. Remove localStorage items
  localStorage.removeItem("token");
  localStorage.removeItem("adminId");
  localStorage.removeItem("user");


  document.cookie = "token=; path=/; max-age=0";

  setDropdownOpen(false);


  router.replace("/login");
};

  return (
    <header
      className=" bg-slate-800 w-full  shadow-md p-4 lg:p-5 flex flex-col lg:flex-row items-center justify-between"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-4">
       <h1 className="text-base sm:text-lg md:text-xl font-semibold text-white truncate"> {title} </h1>
      </div>

      <div className="flex items-center gap-4 mt-3 lg:mt-0 relative" ref={dropdownRef}>
        <div className="text-right">
          <p className="text-sm lg:text-base text-white">{collegeName}</p>
          <p className="text-xs text-white mt-0.5">
            Rs. {balance.toLocaleString()}
          </p>
        </div>

        <div
          className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {avatarIcon}
        </div>

        {dropdownOpen && (
          <div className="absolute right-6 mt-30 bg-white shadow-md rounded-md w-40 z-50">
            <ul>
              <li
                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 cursor-pointer"
                onClick={handleProfileClick}
              >
                <User size={16} /> Edit Profile
              </li>
              <li
                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut size={16} /> Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Profile modal */}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  );
};

export default Header;
