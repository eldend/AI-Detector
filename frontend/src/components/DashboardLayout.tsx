"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onRefresh: () => void;
  onLogout: () => void;
}

export default function DashboardLayout({
  children,
  onRefresh,
  onLogout,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-dark-DEFAULT text-white">
      <Sidebar />
      <div className="flex flex-col flex-grow pt-12">
        <Header onRefresh={onRefresh} onLogout={onLogout} />
        <main className="flex-grow p-4 md:p-8 md:pr-12">{children}</main>
      </div>
    </div>
  );
}
