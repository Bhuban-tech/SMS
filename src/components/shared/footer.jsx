
"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-b from-slate-900 to-slate-950 text-slate-300">
     
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
     
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-r rounded-xl shadow-lg">
                {/* <MessageSquare className="h-8 w-8 text-white" /> */}
              </div>
              <span className="text-2xl font-bold text-white">
                Kritim<span className="text-teal-400">SMS</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-base">
              Reliable bulk SMS service for businesses in Nepal and beyond.  
              Fast delivery 
            </p>

            {/* <div className="flex gap-5">
              <a href="#" className="hover:text-teal-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-teal-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-teal-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-teal-400 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-slate-400">
              <li><Link href="/landing" className="hover:text-teal-400 transition-colors">About Us</Link></li>
      
   <li><Link href="/login" className="hover:text-teal-400 transition-colors">Login</Link></li>
            </ul>
          </div>

       
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3 text-slate-400">
              <li className="hover:text-teal-400 transition-colors">Bulk SMS</li>
              <li className="hover:text-teal-400 transition-colors">Customize template SMS</li>
              {/* <li className="hover:text-teal-400 transition-colors"> SMS </li> */}
            
            </ul>
          </div>


          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-teal-400 mt-1 shrink-0" />
                <span>Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-teal-400 shrink-0" />
                <span>+977 9844266088</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-teal-400 shrink-0" />
                <span>kritimmind@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 text-center md:flex md:justify-between md:items-center text-sm text-slate-500">
          <p>
            © {currentYear} KritimSMS. All rights reserved.
          </p>
          <div className="mt-3 md:mt-0 flex gap-6 justify-center">
            <Link href="/privacy" className="hover:text-teal-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-teal-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;