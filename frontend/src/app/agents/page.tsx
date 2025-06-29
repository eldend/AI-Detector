"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

// Mock data for agents
const mockAgentData = {
  overview: {
    totalAgents: 247,
    onlineAgents: 234,
    offlineAgents: 13,
    criticalAlerts: 3,
    eventsPerSecond: 1247,
    lastUpdated: new Date(),
  },
  agents: [
    {
      id: "agent-001",
      hostname: "WS-DEV-001",
      ip: "192.168.1.100",
      os: "Windows 11 Pro",
      version: "v2.1.3",
      status: "online",
      lastSeen: "2024-12-20 15:30:00",
      events: 1247,
      cpu: 12,
      memory: 256,
      location: "Seoul Office",
      threats: 0,
    },
    {
      id: "agent-002",
      hostname: "SRV-PROD-001",
      ip: "192.168.1.50",
      os: "Ubuntu 22.04 LTS",
      version: "v2.1.3",
      status: "online",
      lastSeen: "2024-12-20 15:29:45",
      events: 2156,
      cpu: 8,
      memory: 512,
      location: "Data Center",
      threats: 1,
    },
    {
      id: "agent-003",
      hostname: "WS-SEC-003",
      ip: "192.168.1.150",
      os: "Windows 10 Enterprise",
      version: "v2.1.2",
      status: "warning",
      lastSeen: "2024-12-20 15:25:12",
      events: 89,
      cpu: 25,
      memory: 128,
      location: "Security Lab",
      threats: 2,
    },
    {
      id: "agent-004",
      hostname: "MAC-EXEC-004",
      ip: "192.168.1.200",
      os: "macOS Sonoma",
      version: "v2.1.1",
      status: "offline",
      lastSeen: "2024-12-20 12:15:30",
      events: 0,
      cpu: 0,
      memory: 0,
      location: "Executive Floor",
      threats: 0,
    },
    {
      id: "agent-005",
      hostname: "LNX-WEB-005",
      ip: "192.168.1.75",
      os: "CentOS 8",
      version: "v2.1.3",
      status: "online",
      lastSeen: "2024-12-20 15:30:05",
      events: 3421,
      cpu: 15,
      memory: 1024,
      location: "Web Server Farm",
      threats: 0,
    },
  ],
  recentEvents: [
    {
      timestamp: "15:30:12",
      agent: "WS-SEC-003",
      event: "Suspicious process execution detected",
      severity: "high",
      action: "Quarantined",
    },
    {
      timestamp: "15:29:45",
      agent: "SRV-PROD-001",
      event: "Network connection to suspicious IP",
      severity: "medium",
      action: "Blocked",
    },
    {
      timestamp: "15:28:30",
      agent: "WS-DEV-001",
      event: "File modification in system directory",
      severity: "low",
      action: "Logged",
    },
    {
      timestamp: "15:27:15",
      agent: "LNX-WEB-005",
      event: "Multiple failed login attempts",
      severity: "medium",
      action: "Alerted",
    },
  ],
};

export default function AgentsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const { isLoggedIn, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400 bg-green-500/10 border-green-500/30";
      case "offline":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "warning":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-blue-400";
      default:
        return "text-slate-400";
    }
  };

  const filteredAgents = mockAgentData.agents.filter((agent) => {
    const matchesSearch =
      agent.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.ip.includes(searchQuery) ||
      agent.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center relative">
        {/* Loading animation */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-xl animate-float-delay-1"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-green-500/15 to-blue-500/15 rounded-full blur-xl animate-float-delay-2"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-slate-400 text-sm font-mono">
                  agent-manager://scan --all-endpoints
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="text-cyan-400 font-mono text-sm mb-4">
                $ agent-discovery --scan --realtime
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-4 h-4 border-2 border-cyan-500/50 border-t-cyan-500 rounded-full animate-spin"></div>
                <span className="text-slate-300 font-mono text-sm">
                  보안 에이전트 스캔 중...
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-slate-400">
                  {">"} Scanning network endpoints
                </div>
                <div className="text-slate-400">
                  {">"} Checking agent status
                </div>
                <div className="text-slate-400">
                  {">"} Collecting performance metrics
                </div>
                <div className="text-cyan-400 animate-pulse">
                  {">"} Initializing agent dashboard...
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl">로그인이 필요합니다.</div>
      </main>
    );
  }

  return (
    <DashboardLayout onLogout={handleLogout} onOpenSettings={() => {}}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-xl animate-float-delay-1"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-green-500/15 to-blue-500/15 rounded-full blur-xl animate-float-delay-2"></div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden"
        >
          <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-slate-400 text-sm font-mono ml-2">
              agent-control-center://management --dashboard
            </span>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-4 text-sm font-mono mb-4">
              <span className="text-cyan-400">security@agents:~$</span>
              <span className="text-slate-300">
                status --overview --realtime
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-cyan-400 font-mono mb-2">
                Security Agent Control Center
              </h1>
              <p className="text-slate-400 font-mono text-sm">
                엔드포인트 보안 에이전트 실시간 관리 및 모니터링
              </p>
            </div>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {[
            {
              label: "총 에이전트",
              value: mockAgentData.overview.totalAgents,
              color: "text-blue-400",
            },
            {
              label: "온라인",
              value: mockAgentData.overview.onlineAgents,
              color: "text-green-400",
            },
            {
              label: "오프라인",
              value: mockAgentData.overview.offlineAgents,
              color: "text-red-400",
            },
            {
              label: "위험 알림",
              value: mockAgentData.overview.criticalAlerts,
              color: "text-yellow-400",
            },
            {
              label: "초당 이벤트",
              value: mockAgentData.overview.eventsPerSecond,
              color: "text-purple-400",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-slate-400 text-xs font-mono">
                  {stat.label}
                </span>
              </div>
              <div className={`text-2xl font-bold font-mono ${stat.color}`}>
                {stat.value.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Controls and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg p-4"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="호스트명, IP, 위치로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-slate-300 placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-slate-300 font-mono text-sm focus:outline-none focus:border-cyan-500/50"
              >
                <option value="all">모든 상태</option>
                <option value="online">온라인</option>
                <option value="offline">오프라인</option>
                <option value="warning">경고</option>
              </select>

              <div className="flex border border-slate-600/50 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 text-sm font-mono transition-colors ${
                    viewMode === "list"
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  목록
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 text-sm font-mono transition-colors ${
                    viewMode === "grid"
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  그리드
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Agents List/Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden"
        >
          <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-slate-400 text-sm font-mono ml-2">
              agent-list --status --metrics --realtime
            </span>
          </div>

          <div className="p-4">
            {viewMode === "list" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-3 px-4 text-slate-400 font-mono">
                        호스트명
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-mono">
                        IP 주소
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-mono">
                        운영체제
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-mono">
                        상태
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-mono">
                        버전
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-mono">
                        위치
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-mono">
                        이벤트
                      </th>
                      <th className="text-left py-3 px-4 text-slate-400 font-mono">
                        위협
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAgents.map((agent, index) => (
                      <motion.tr
                        key={agent.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedAgent(agent)}
                        className="border-b border-slate-700/30 hover:bg-slate-800/30 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 text-slate-300 font-mono">
                          {agent.hostname}
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono">
                          {agent.ip}
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono">
                          {agent.os}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2 py-1 rounded border font-mono ${getStatusColor(
                              agent.status
                            )}`}
                          >
                            {agent.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono">
                          {agent.version}
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono">
                          {agent.location}
                        </td>
                        <td className="py-3 px-4 text-cyan-400 font-mono">
                          {agent.events.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-mono ${
                              agent.threats > 0
                                ? "text-red-400"
                                : "text-green-400"
                            }`}
                          >
                            {agent.threats}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAgents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedAgent(agent)}
                    className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-slate-300 font-mono font-medium">
                        {agent.hostname}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded border font-mono ${getStatusColor(
                          agent.status
                        )}`}
                      >
                        {agent.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">IP:</span>
                        <span className="text-slate-400 font-mono">
                          {agent.ip}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">OS:</span>
                        <span className="text-slate-400 font-mono">
                          {agent.os}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">이벤트:</span>
                        <span className="text-cyan-400 font-mono">
                          {agent.events.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">위협:</span>
                        <span
                          className={`font-mono ${
                            agent.threats > 0
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {agent.threats}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden"
        >
          <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-slate-400 text-sm font-mono ml-2">
              event-stream --latest --agents
            </span>
          </div>

          <div className="p-4">
            <h3 className="text-orange-400 font-mono text-sm mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              최근 에이전트 이벤트
            </h3>
            <div className="space-y-2">
              {mockAgentData.recentEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 bg-slate-800/30 rounded border border-slate-700/30"
                >
                  <span className="text-slate-500 font-mono text-xs">
                    {event.timestamp}
                  </span>
                  <span className="text-cyan-400 font-mono text-xs">
                    {event.agent}
                  </span>
                  <span className="text-slate-300 font-mono text-xs flex-1">
                    {event.event}
                  </span>
                  <span
                    className={`font-mono text-xs ${getSeverityColor(
                      event.severity
                    )}`}
                  >
                    {event.severity.toUpperCase()}
                  </span>
                  <span className="text-slate-400 font-mono text-xs">
                    {event.action}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Agent Detail Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900/95 border border-slate-700/50 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-slate-400 text-sm font-mono ml-2">
                    agent-detail://{selectedAgent.hostname}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-cyan-400 font-mono mb-4">
                  {selectedAgent.hostname}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-slate-400 font-mono text-sm mb-2">
                        기본 정보
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">IP 주소:</span>
                          <span className="text-slate-300 font-mono">
                            {selectedAgent.ip}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">운영체제:</span>
                          <span className="text-slate-300 font-mono">
                            {selectedAgent.os}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">버전:</span>
                          <span className="text-slate-300 font-mono">
                            {selectedAgent.version}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">위치:</span>
                          <span className="text-slate-300 font-mono">
                            {selectedAgent.location}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">마지막 연결:</span>
                          <span className="text-slate-300 font-mono">
                            {selectedAgent.lastSeen}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-slate-400 font-mono text-sm mb-2">
                        성능 정보
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">CPU 사용률:</span>
                          <span className="text-cyan-400 font-mono">
                            {selectedAgent.cpu}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">메모리 사용량:</span>
                          <span className="text-cyan-400 font-mono">
                            {selectedAgent.memory}MB
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">처리된 이벤트:</span>
                          <span className="text-cyan-400 font-mono">
                            {selectedAgent.events.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">탐지된 위협:</span>
                          <span
                            className={`font-mono ${
                              selectedAgent.threats > 0
                                ? "text-red-400"
                                : "text-green-400"
                            }`}
                          >
                            {selectedAgent.threats}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded text-blue-300 font-mono text-sm transition-colors">
                    재시작
                  </button>
                  <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded text-green-300 font-mono text-sm transition-colors">
                    업데이트
                  </button>
                  <button className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded text-yellow-300 font-mono text-sm transition-colors">
                    격리
                  </button>
                  <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded text-red-300 font-mono text-sm transition-colors">
                    제거
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
