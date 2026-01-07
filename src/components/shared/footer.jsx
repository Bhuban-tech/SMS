"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-200 text-slate-700 py-6 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="border-t border-slate-300 pt-8 text-center text-sm">
          <p className="text-slate-800">
            © {new Date().getFullYear()} KritimSMS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;