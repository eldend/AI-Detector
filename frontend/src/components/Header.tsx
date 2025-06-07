"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface HeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
}

export default function Header({ onRefresh, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex justify-end items-center p-4 md:p-8 md:pr-12">
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh}
          className="btn btn-primary"
        >
          Refresh Data
        </motion.button>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-dark-lighter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </motion.button>

          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 mt-2 w-48 bg-dark-light rounded-md shadow-lg py-1 z-10 border border-gray-700"
            >
              <a
                href="#"
                className="block px-4 py-2 text-sm hover:bg-dark-lighter"
              >
                Settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm hover:bg-dark-lighter"
              >
                Reports
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm hover:bg-dark-lighter"
              >
                Help
              </a>
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-dark-lighter"
              >
                로그아웃
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
