"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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

  const [showAdvanced, setShowAdvanced] = useState(false);

  // 주요 메뉴 (초보자용)
  const mainNavItems: Array<{
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
      label: "홈 대시보드",
      command: "전체 현황 보기",
      status: "ACTIVE",
      description: "보안 상황을 한눈에 확인하세요",
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
      label: "보안 알림",
      command: "위험 알림 확인",
      status: "MONITORING",
      description: "의심스러운 활동이나 문제를 확인하세요",
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
      href: "/agents",
      label: "PC 관리",
      command: "컴퓨터 상태 확인",
      status: "ONLINE",
      description: "연결된 컴퓨터들의 보안 상태를 확인하세요",
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
      href: "/settings",
      label: "설정",
      command: "환경 설정",
      status: "IDLE",
      description: "사용자 설정 및 환경을 관리하세요",
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

  // 고급 기능 메뉴
  const advancedNavItems: Array<{
    href: string;
    label: string;
    command: string;
    icon: React.ReactNode;
    status?: string;
    description?: string;
  }> = [
    {
      href: "/tracing",
      label: "데이터 처리",
      command: "데이터 변환 실행",
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
      command: "탐지 규칙 관리",
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
      command: "AI 분석 실행",
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
      command: "정책 설정",
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
      label: "대응 제안",
      command: "대응 제안 관리",
      status: "READY",
      description: "위험한 상황에 대한 대응 방안을 제안하고 관리합니다",
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
            <span className="text-slate-400 text-sm">보안 네비게이션</span>
          </div>
        </div>

        {/* Logo/Brand */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-700/50 border border-slate-600/50 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Project Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <h1 className="text-base font-bold text-white">ShiftX</h1>
              <p className="text-xs text-slate-400 -mt-1">
                v2.3.1 | 빌드 2024.3
              </p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-slate-800/50 rounded border border-slate-700/50 p-2 mt-3">
          <div className="text-xs text-slate-400 mb-2">시스템 상태</div>
          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400">온라인</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-400">보안</span>
            </div>
          </div>
          <div className="text-slate-500 text-xs">
            {currentTime.toLocaleString("ko-KR", {
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
        <div className="text-green-400 text-xs mb-4 font-mono">주요 기능</div>

        {/* 주요 메뉴 */}
        <ul className="space-y-1 mb-6">
          {mainNavItems.map((item, index) => {
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
                        <div className="text-xs text-slate-600 font-mono truncate">
                          {item.command}
                        </div>
                      </div>
                    </div>

                    {item.status && (
                      <div className="flex items-center gap-1">
                        {getStatusDot(item.status)}
                        <span
                          className={`text-xs w-20 text-center inline-block ${getStatusColor(
                            item.status
                          )}`}
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
                        <div className="text-xs text-slate-600 font-mono truncate">
                          {item.command}
                        </div>
                      </div>
                    </div>

                    {item.status && (
                      <div className="flex items-center gap-1">
                        {getStatusDot(item.status)}
                        <span
                          className={`text-xs w-20 text-center inline-block ${getStatusColor(
                            item.status
                          )}`}
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

        {/* 고급 기능 섹션 */}
        <div className="border-t border-slate-700/50 pt-4">
          <motion.button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full p-2 text-xs text-slate-400 hover:text-slate-300 transition-colors"
          >
            <span className="font-mono">고급 기능</span>
            <motion.svg
              animate={{ rotate: showAdvanced ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </motion.button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1 mt-2 overflow-hidden"
              >
                {advancedNavItems.map((item, index) => {
                  const isActive = pathname === item.href;

                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <Link
                        href={item.href}
                        className={`group flex items-center justify-between p-2 pl-6 rounded border transition-all duration-200 w-full text-left ${
                          isActive
                            ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                            : "border-slate-700/30 text-slate-400 hover:bg-slate-800/30 hover:border-slate-600/30 hover:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span
                            className={`${
                              isActive ? "text-blue-400" : "text-slate-500"
                            } group-hover:text-slate-400`}
                          >
                            {item.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`text-xs ${
                                isActive ? "text-blue-300" : "text-slate-400"
                              }`}
                            >
                              {item.label}
                            </div>
                          </div>
                        </div>

                        {item.status && (
                          <div className="flex items-center gap-1">
                            {getStatusDot(item.status)}
                          </div>
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Terminal Footer */}
      <div className="border-t border-slate-800/50 p-4">
        <div className="text-xs text-slate-400 text-center">
          준비 완료 • 모든 시스템 정상 작동
        </div>
      </div>
    </motion.aside>
  );
}
