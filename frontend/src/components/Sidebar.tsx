"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { ensureEventLogWidgets } = useDashboard();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEventLogClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname !== "/dashboard") {
      router.push("/dashboard");
    }
    setTimeout(() => {
      ensureEventLogWidgets();
    }, 100);
  };

  const navItems: Array<{
    href: string;
    label: string;
    command: string;
    icon: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    status?: string;
  }> = [
    {
      href: "/dashboard",
      label: "Dashboard",
      command: "dashboard --realtime",
      status: "ACTIVE",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      href: "/events",
      label: "Event Logs",
      command: "tail -f events.log",
      status: "MONITORING",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      href: "/analysis",
      label: "ML Analysis",
      command: "analyze --ml-model",
      status: "READY",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      href: "/policy",
      label: "Security Policy",
      command: "policy --configure",
      status: "LOADED",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      href: "/response",
      label: "Incident Response",
      command: "incident --respond",
      status: "STANDBY",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    {
      href: "/settings",
      label: "System Config",
      command: "config --edit",
      status: "IDLE",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
      ),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-400";
      case "MONITORING":
        return "text-blue-400";
      case "READY":
        return "text-cyan-400";
      case "LOADED":
        return "text-violet-400";
      case "STANDBY":
        return "text-yellow-400";
      default:
        return "text-slate-400";
    }
  };

  const getStatusDot = (status: string) => {
    const color = getStatusColor(status);
    return (
      <div
        className={`w-2 h-2 rounded-full ${color.replace(
          "text-",
          "bg-"
        )} animate-pulse`}
      ></div>
    );
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 flex flex-col shadow-2xl font-mono"
    >
      {/* Terminal Header */}
      <div className="bg-slate-800/70 border-b border-slate-700/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div className="flex-1 text-center">
            <span className="text-slate-400 text-sm">
              ai-security-nav.terminal
            </span>
          </div>
        </div>

        {/* Logo/Brand */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Security Control</h1>
              <p className="text-xs text-slate-400 -mt-1">
                v2.1.3 | Build 2024.1
              </p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-slate-800/50 rounded border border-slate-700/50 p-2 mt-3">
          <div className="text-xs text-slate-400 mb-1">SYSTEM STATUS</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400">ONLINE</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-400">SECURED</span>
            </div>
          </div>
          <div className="text-slate-500 text-xs mt-1">
            {currentTime.toLocaleString("en-US", {
              hour12: false,
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-4">
        <div className="text-green-400 text-xs mb-4 font-mono">
          $ ls -la /security/modules
        </div>

        <ul className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className={`group flex items-center justify-between p-3 rounded border transition-all duration-200 w-full text-left ${
                      isActive
                        ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                        : "border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:border-slate-600/50 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span
                        className={`${
                          isActive ? "text-blue-400" : "text-slate-400"
                        } group-hover:text-slate-300`}
                      >
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-xs font-semibold ${
                            isActive ? "text-blue-300" : "text-slate-300"
                          }`}
                        >
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          $ {item.command}
                        </div>
                      </div>
                    </div>

                    {item.status && (
                      <div className="flex items-center gap-1">
                        {getStatusDot(item.status)}
                        <span
                          className={`text-xs ${getStatusColor(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`group flex items-center justify-between p-3 rounded border transition-all duration-200 w-full text-left ${
                      isActive
                        ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                        : "border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:border-slate-600/50 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span
                        className={`${
                          isActive ? "text-blue-400" : "text-slate-400"
                        } group-hover:text-slate-300`}
                      >
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-xs font-semibold ${
                            isActive ? "text-blue-300" : "text-slate-300"
                          }`}
                        >
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          $ {item.command}
                        </div>
                      </div>
                    </div>

                    {item.status && (
                      <div className="flex items-center gap-1">
                        {getStatusDot(item.status)}
                        <span
                          className={`text-xs ${getStatusColor(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    )}
                  </Link>
                )}
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Terminal Footer */}
      <div className="border-t border-slate-800/50 p-4">
        <div className="text-xs text-slate-400 text-center">
          Terminal Ready • All Systems Operational
        </div>
      </div>
    </motion.aside>
  );
}
