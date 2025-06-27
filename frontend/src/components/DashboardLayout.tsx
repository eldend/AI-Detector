"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  onOpenSettings?: () => void;
}

export default function DashboardLayout({
  children,
  onLogout,
  onOpenSettings,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-full bg-app-background text-app-text">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Header onLogout={onLogout} onOpenSettings={onOpenSettings} />
        <main className="flex flex-col flex-grow p-4 md:p-8 md:pr-12 min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
