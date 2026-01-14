"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Users, LogOut, User, LogIn } from "lucide-react";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { handleLogout } from "@/lib/auth";
import ProfileModal from "./profile/ProfileModal";


const Header = ({
  collegeName = "Aadim National College",
  balance = 5000,
  bgColor = "bg-white",
  title,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

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

  const handleLogoutClick = () => {
    handleLogout(dispatch, router, logoutAction);
    setDropdownOpen(false);
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const getUserInitial = () => {
    if (user?.username) return user.username.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  const getDisplayName = () => {
    return user?.username || user?.email?.split("@")[0] || "User";
  };

  return (
    <header className="bg-slate-800 w-full shadow-md p-4 lg:p-5 flex flex-col lg:flex-row items-center justify-between">
      <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-4">
        
        <h1 className="text-base sm:text-lg md:text-xl font-semibold text-white truncate">
          {title}
        </h1>
      </div>

      <div
        className="flex items-center gap-4 mt-3 lg:mt-0 relative"
        ref={dropdownRef}
      >
        {isAuthenticated && user ? (
          <>
            <div className="text-right hidden sm:block">
              {/* <p className="text-sm lg:text-base text-white font-medium">
                {getDisplayName()}
              </p> */}
              {/* <p className="text-xs text-white/80 mt-0.5">{user.email}</p> */}
            </div>

            <div
              className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center shrink-0 cursor-pointer hover:bg-teal-600 transition-colors ring-2 ring-white/20"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="text-white font-bold text-lg">
                {getUserInitial()}
              </span>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg w-48 z-50 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <ul>
                  <li
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-gray-700 transition-colors"
                    onClick={handleProfileClick}
                  >
                    <User size={16} className="text-gray-600" />
                    <span className="text-sm">Edit Profile</span>
                  </li>
                  <li
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 cursor-pointer text-red-600 transition-colors border-t border-gray-100"
                    onClick={handleLogoutClick}
                  >
                    <LogOut size={16} />
                    <span className="text-sm font-medium">Logout</span>
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={handleLoginClick}
            className="flex items-center gap-2 
                       px-3 py-2 sm:px-6 sm:py-2.5 
                       bg-teal-500 hover:bg-teal-600 
                       text-white font-semibold 
                       rounded-lg transition-colors shadow-md
                       w-9 sm:w-auto justify-center"
          >
            <User size={18} />
              <span className="hidden sm:inline">Login</span>
          </button>
        )}
      </div>

      {isAuthenticated && (
        <ProfileModal
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;