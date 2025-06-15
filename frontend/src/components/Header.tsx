"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onLogout: () => void;
  onOpenSettings?: () => void;
}

export default function Header({ onLogout, onOpenSettings }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  const menuItems = [
    { label: "Reports", href: "#" },
    { label: "Help", href: "#" },
  ];

  return (
    <header className="flex justify-end items-center p-4 md:p-6 md:pr-10">
      <div className="flex items-center space-x-4">
        {/* User Profile Section */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-app-primary to-app-secondary rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-semibold">
              {currentUser?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-app-text">
              {currentUser || "User"}
            </p>
            <p className="text-xs text-app-text-600">온라인</p>
          </div>
        </div>

        {/* Menu Button */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg bg-app-background-600 backdrop-blur-sm border border-app-primary-300 hover:bg-app-background-800 transition-all duration-200 shadow-sm"
          >
            <motion.svg
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-app-text"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-app-background-800 backdrop-blur-md rounded-xl shadow-xl border border-app-primary-300 py-2 z-10"
              >
                {/* Settings Button */}
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0 }}
                  onClick={() => {
                    onOpenSettings?.();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-app-text hover:bg-app-primary-100 hover:text-app-primary transition-all duration-200 rounded-lg mx-2 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  대시보드 설정
                </motion.button>

                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: (index + 1) * 0.05 }}
                    className="block px-4 py-2 text-sm text-app-text hover:bg-app-primary-100 hover:text-app-primary transition-all duration-200 rounded-lg mx-2"
                  >
                    {item.label}
                  </motion.a>
                ))}

                <div className="border-t border-app-primary-200 my-2 mx-2" />

                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: (menuItems.length + 1) * 0.05,
                  }}
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 hover:text-danger transition-all duration-200 rounded-lg mx-2"
                >
                  로그아웃
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
