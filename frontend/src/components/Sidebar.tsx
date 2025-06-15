"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { ensureEventLogWidgets } = useDashboard();

  const handleEventLogClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // 대시보드 페이지로 이동
    if (pathname !== "/") {
      router.push("/");
    }
    // 이벤트로그 위젯이 없으면 생성
    setTimeout(() => {
      ensureEventLogWidgets();
    }, 100);
  };

  const navItems: Array<{
    href: string;
    label: string;
    icon: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
  }> = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg
          className="h-5 w-5"
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
      label: "Events",
      icon: (
        <svg
          className="h-5 w-5"
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
      href: "/settings",
      label: "Settings",
      icon: (
        <svg
          className="h-5 w-5"
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

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-app-background-700 backdrop-blur-md border-r border-app-primary-200 p-6 flex flex-col shadow-lg"
    >
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-app-primary to-app-secondary bg-clip-text text-transparent">
          AI Detector
        </h1>
        <p className="text-xs text-app-text-600 mt-1">Security Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className={`group flex items-center p-3 rounded-lg transition-all duration-200 w-full text-left ${
                      isActive
                        ? "bg-app-primary-200 text-app-primary border border-app-primary-300 shadow-sm"
                        : "text-app-text-700 hover:text-app-text hover:bg-app-primary-100"
                    }`}
                  >
                    <span
                      className={`mr-3 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-app-primary" : ""
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-app-primary rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`group flex items-center p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-app-primary-200 text-app-primary border border-app-primary-300 shadow-sm"
                        : "text-app-text-700 hover:text-app-text hover:bg-app-primary-100"
                    }`}
                  >
                    <span
                      className={`mr-3 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-app-primary" : ""
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-app-primary rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                )}
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-app-primary-200">
        <p className="text-xs text-app-text-500 text-center">
          &copy; 2024 AI Detector
        </p>
      </div>
    </motion.aside>
  );
}
