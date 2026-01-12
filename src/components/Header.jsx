"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { LogOut, User, LogIn } from "lucide-react";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { handleLogout } from "@/lib/auth";
import ProfileModal from "./profile/ProfileModal";

const Header = ({ title }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.username || "User";
  const email = user?.email || "";

  const getInitial = () =>
    displayName.charAt(0).toUpperCase();

  return (
    <>
      <header className="bg-slate-800 w-full shadow-md p-4 flex flex-col sm:flex-row items-center justify-between">
        {/* TITLE */}
        <h1 className="text-white font-semibold text-lg truncate">
          {title}
        </h1>

        {/* USER AREA */}
        <div
          className="flex items-center gap-4 mt-3 sm:mt-0 relative"
          ref={dropdownRef}
        >
          {isAuthenticated ? (
            <>
              {/* USER NAME + EMAIL */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">
                  {displayName}
                </p>
                <p className="text-xs text-white/80">
                  {email}
                </p>
              </div>

              {/* AVATAR */}
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-600 transition ring-2 ring-white/20"
              >
                <span className="text-white font-bold">
                  {getInitial()}
                </span>
              </div>

              {/* DROPDOWN */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b">
                    <p className="text-sm font-semibold truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setProfileOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <User size={16} /> Edit Profile
                  </button>

                  <button
                    onClick={() =>
                      handleLogout(dispatch, router, logoutAction)
                    }
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 bg-teal-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-teal-600"
            >
              <LogIn size={16} /> Login
            </button>
          )}
        </div>
      </header>

      {profileOpen && (
        <ProfileModal onClose={() => setProfileOpen(false)} />
      )}
    </>
  );
};

export default Header;
