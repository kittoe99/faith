"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  activeSection: string;
}

const menuItems = [
  { id: "home", label: "Dashboard", icon: "fas fa-tachometer-alt" },
  { id: "altar", label: "Altar", icon: "fas fa-praying-hands" },
  { id: "bible", label: "Bible", icon: "fas fa-book-bible" },
  { id: "bible-study", label: "Study", icon: "fas fa-graduation-cap" },
  { id: "tasks", label: "Tasks", icon: "fas fa-tasks" },
  { id: "journal", label: "Journal", icon: "fas fa-feather-alt" },
  { id: "income-tithes", label: "Income & Tithes", icon: "fas fa-hand-holding-usd" },
  { id: "ai", label: "Ai", icon: "fas fa-robot" }

];

export default function MobileBottomNav({ activeSection }: Props) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const handleNav = (id: string) => {
    window.location.hash = id;
    setExpanded(false);
  };

  return (
    <>
      {/* Backdrop when expanded */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998] md:hidden"
          onClick={toggleExpanded}
        />
      )}

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-[999]">
        <div className="mx-auto max-w-screen-sm">
          <div className="relative bg-white border-t border-gray-200 shadow-lg">
            {/* Collapsed row */}
            <div className="flex justify-around py-2">
              {menuItems.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  className={`flex flex-col items-center text-xs px-2 ${activeSection === item.id ? "text-purple-600" : "text-gray-500"}`}
                  onClick={() => handleNav(item.id)}
                >
                  <i className={`text-3xl ${item.icon}`}></i>
                </button>
              ))}
              {/* Menu toggle */}
              <button
                onClick={toggleExpanded}
                className="flex flex-col items-center text-xs px-2 text-gray-700"
              >
                <i className={`text-lg ${expanded ? "fas fa-times" : "fas fa-ellipsis-h"}`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded sheet */}
      {expanded && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden z-[999] animate-slide-up">
          <div className="bg-white rounded-t-2xl shadow-2xl pt-4 pb-10 px-6 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                    activeSection === item.id ? "text-purple-600" : "text-gray-700"
                  }`}
                  onClick={() => handleNav(item.id)}
                >
                  <i className={`text-4xl mb-1 ${item.icon}`}></i>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
