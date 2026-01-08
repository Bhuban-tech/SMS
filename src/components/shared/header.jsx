"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const router = useRouter();

  return (
    <header className="w-full px-6 lg:px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800">KritimSMS</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/login")}
            className="bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-9 py-4 rounded-full shadow-lg cursor-pointer "
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;