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
    description?: string;
  }> = [
    {
      href: "/dashboard",
      label: "보안 대시보드",
      command: "dashboard --overview",
      status: "ACTIVE",
      description: "보안 현황을 한눈에 확인하세요",
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
      href: "/agents",
      label: "에이전트 관리",
      command: "agent --monitor",
      status: "ONLINE",
      description: "PC와 서버의 보안 상태를 관리하세요",
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
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      href: "/events",
      label: "보안 이벤트",
      command: "tail -f events.log",
      status: "MONITORING",
      description: "발생한 보안 이벤트를 실시간으로 확인하세요",
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
      href: "/tracing",
      label: "데이터 처리",
      command: "trace --pipeline",
      status: "PROCESSING",
      description: "수집된 데이터를 분석 가능한 형태로 변환합니다",
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
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
    },
    {
      href: "/rules",
      label: "위협 탐지 규칙",
      command: "rules --manage",
      status: "LOADED",
      description: "어떤 상황을 위험으로 판단할지 설정하세요",
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
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          />
        </svg>
      ),
    },
    {
      href: "/analysis",
      label: "AI 위협 분석",
      command: "langgraph --analyze",
      status: "READY",
      description: "AI가 자동으로 위협을 분석하고 판단합니다",
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      href: "/policy",
      label: "보안 정책",
      command: "policy --configure",
      status: "LOADED",
      description: "시스템 전체의 보안 정책을 설정하세요",
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
      label: "자동 대응",
      command: "response --auto",
      status: "STANDBY",
      description: "위험한 상황을 자동으로 차단하고 대응합니다",
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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      href: "/settings",
      label: "시스템 설정",
      command: "config --system",
      status: "IDLE",
      description: "시스템 환경과 사용자 설정을 관리하세요",
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
      case "ONLINE":
        return "text-emerald-400";
      case "MONITORING":
        return "text-blue-400";
      case "PROCESSING":
        return "text-orange-400";
      case "READY":
        return "text-cyan-400";
      case "LOADED":
        return "text-violet-400";
      case "STANDBY":
        return "text-yellow-400";
      case "IDLE":
        return "text-slate-400";
      default:
        return "text-slate-500";
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
              <h1 className="text-lg font-bold text-white">AI 보안 시스템</h1>
              <p className="text-xs text-slate-400 -mt-1">
                v2.1.3 | 실시간 보안 모니터링
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
              <span className="text-green-400">정상 운영</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-400">보안 유지</span>
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
          $ 보안 모듈 목록 조회 중...
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
                        {item.description && (
                          <div className="text-xs text-slate-500 truncate mb-1">
                            {item.description}
                          </div>
                        )}
                        <div className="text-xs text-slate-600 font-mono truncate">
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
                        {item.description && (
                          <div className="text-xs text-slate-500 truncate mb-1">
                            {item.description}
                          </div>
                        )}
                        <div className="text-xs text-slate-600 font-mono truncate">
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
