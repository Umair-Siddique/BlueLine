// ChatLayout.jsx
import React, { useState, useEffect } from "react";

const ChatLayout = ({ sidebar, main }) => {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isDesktopCollapsed, setDesktopCollapsed] = useState(false);

  useEffect(() => {
    const onKey = (e) =>
      e.key === "Escape" && isMobileOpen && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileOpen]);

  return (
    <div className="h-screen flex flex-col sm:flex-row bg-gray-50 dark:bg-gray-900 relative">
      {/* Mobile header with toggle */}
      <div className="sm:hidden p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-30">
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            {isMobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
          <span>{isMobileOpen ? "Close" : "Menu"}</span>
        </button>
        <div className="text-lg font-semibold text-gray-800 dark:text-white">
          Chat App
        </div>
      </div>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm z-10 transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gray-800 dark:bg-gray-900 border-r border-gray-700 z-20 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } sm:hidden overflow-hidden shadow-xl`}
      >
        <div className="h-full overflow-y-auto py-2">{sidebar}</div>
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden sm:block relative h-full bg-gray-800 dark:bg-gray-900 border-r border-gray-700 transition-all duration-300 ease-in-out ${
          isDesktopCollapsed ? "w-16" : "w-72 md:w-80"
        }`}
      >
        {/* Collapse toggle */}
        <div className="absolute -right-3 top-4 z-10">
          <button
            onClick={() => setDesktopCollapsed((c) => !c)}
            aria-label={
              isDesktopCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-3 h-3 transition-transform duration-300 ${
                isDesktopCollapsed ? "rotate-180" : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar content */}
        <div
          className={`h-full overflow-y-auto py-4 transition-opacity duration-300 ${
            isDesktopCollapsed ? "opacity-0 invisible" : "opacity-100 visible"
          }`}
        >
          {sidebar}
        </div>

        {/* Collapsed sidebar icons */}
        {isDesktopCollapsed && (
          <div className="py-4 px-2 flex flex-col items-center space-y-6">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
            </button>
            <div className="mt-auto">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      
    </div>
  );
};

export default ChatLayout;