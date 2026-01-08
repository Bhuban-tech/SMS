"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Home,
  LayoutDashboard,
  Users,
  Folder,
  FileText,
  Layers,
} from "lucide-react";

const NAV = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", href: "/docs/introduction", icon: Home },
      { label: "Landing & Login", href: "/docs/landing-login", icon: FileText },
    ],
  },
  {
    title: "Core Features",
    items: [
      { label: "Dashboard", href: "/docs/dashboard", icon: LayoutDashboard },
      { label: "Contacts", href: "/docs/contacts", icon: Users },
      { label: "Groups", href: "/docs/groups", icon: Folder },
      { label: "Templates & SMS", href: "/docs/templates", icon: Layers },
      { label: "Reports", href: "/docs/reports", icon: FileText },
    ],
  },
];

export default function DocSidebar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(() =>
    Object.fromEntries(NAV.map((s) => [s.title, true]))
  );

  const toggle = (title) =>
    setOpen((prev) => ({ ...prev, [title]: !prev[title] }));

  return (
    <div className="space-y-6">
      {NAV.map((section) => (
        <div key={section.title} className="space-y-2">
          {/* Section Header */}
          <button
            onClick={() => toggle(section.title)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm
              font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400
              hover:text-gray-900 dark:hover:text-gray-200 transition"
          >
            <span>{section.title}</span>
            {open[section.title] ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          {/* Links */}
          {open[section.title] && (
            <ul className="space-y-1 pl-2">
              {section.items.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                        transition-all duration-200
                        ${
                          active
                            ? "bg-blue-600/15 text-blue-600 dark:text-blue-400 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-800/60"
                        }`}
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
