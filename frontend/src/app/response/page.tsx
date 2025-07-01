"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

// Mock data for automated response system (inspired by EDR products)
const mockResponseData = {
  statistics: {
    activeThreats: 7,
    autoBlocked: 89,
    manualActions: 23,
    avgResponseTime: 2.3,
    successRate: 98.7,
    isolatedHosts: 3,
  },
  responseTypes: [
    {
      id: "isolation",
      name: "호스트 격리",
      count: 15,
      color: "text-red-400",
      automated: true,
    },
    {
      id: "process-kill",
      name: "프로세스 종료",
      count: 34,
      color: "text-orange-400",
      automated: true,
    },
    {
      id: "network-block",
      name: "네트워크 차단",
      count: 28,
      color: "text-yellow-400",
      automated: false,
    },
    {
      id: "file-quarantine",
      name: "파일 격리",
      count: 19,
      color: "text-green-400",
      automated: true,
    },
    {
      id: "rollback",
      name: "시스템 복구",
      count: 8,
      color: "text-blue-400",
      automated: false,
    },
  ],
  activeIncidents: [
    {
      id: "incident-001",
      threat: "Ransomware Detection",
      severity: "CRITICAL",
      status: "RESPONDING",
      target: "WS-PROD-045",
      detectedAt: "2024-12-20 15:42:18",
      responseTime: "1.2초",
      actions: ["ISOLATED", "PROCESS_KILLED", "FILES_QUARANTINED"],
      description: "랜섬웨어 암호화 활동 탐지 및 자동 격리 수행",
      mitreId: "T1486",
      autoResponse: true,
    },
    {
      id: "incident-002",
      threat: "Lateral Movement",
      severity: "HIGH",
      status: "BLOCKED",
      target: "SRV-DB-012",
      detectedAt: "2024-12-20 15:38:45",
      responseTime: "0.8초",
      actions: ["NETWORK_BLOCKED", "SESSION_TERMINATED"],
      description: "측면 이동 시도 차단",
      mitreId: "T1021",
      autoResponse: true,
    },
    {
      id: "incident-003",
      threat: "Data Exfiltration",
      severity: "HIGH",
      status: "INVESTIGATING",
      target: "WS-DEV-021",
      detectedAt: "2024-12-20 15:35:12",
      responseTime: "2.1초",
      actions: ["NETWORK_MONITORED", "FILES_TRACKED"],
      description: "대용량 데이터 외부 전송 시도",
      mitreId: "T1041",
      autoResponse: false,
    },
    {
      id: "incident-004",
      threat: "Process Injection",
      severity: "MEDIUM",
      status: "CONTAINED",
      target: "WS-ADMIN-003",
      detectedAt: "2024-12-20 15:30:33",
      responseTime: "1.7초",
      actions: ["PROCESS_KILLED", "MEMORY_DUMPED"],
      description: "프로세스 인젝션 기법 탐지 및 차단",
      mitreId: "T1055",
      autoResponse: true,
    },
  ],
  responseActions: [
    {
      id: "action-001",
      type: "AUTO_ISOLATION",
      name: "자동 호스트 격리",
      description: "악성 활동 탐지 시 즉시 네트워크에서 격리",
      enabled: true,
      priority: 1,
      conditions: ["severity >= HIGH", "malware_detected", "lateral_movement"],
      avgExecutionTime: "0.5초",
      successRate: 99.2,
    },
    {
      id: "action-002",
      type: "PROCESS_TERMINATION",
      name: "악성 프로세스 종료",
      description: "의심스러운 프로세스 즉시 종료",
      enabled: true,
      priority: 2,
      conditions: [
        "process_injection",
        "code_injection",
        "suspicious_behavior",
      ],
      avgExecutionTime: "0.2초",
      successRate: 97.8,
    },
    {
      id: "action-003",
      type: "NETWORK_BLOCKING",
      name: "네트워크 차단",
      description: "악성 IP/도메인 자동 차단",
      enabled: true,
      priority: 3,
      conditions: ["c2_communication", "data_exfiltration", "malicious_domain"],
      avgExecutionTime: "1.1초",
      successRate: 98.5,
    },
    {
      id: "action-004",
      type: "FILE_QUARANTINE",
      name: "파일 격리",
      description: "악성 파일을 안전한 위치로 이동",
      enabled: true,
      priority: 4,
      conditions: ["malware_file", "suspicious_executable", "encrypted_file"],
      avgExecutionTime: "2.3초",
      successRate: 96.9,
    },
  ],
  playbooks: [
    {
      id: "playbook-001",
      name: "Ransomware Response",
      description: "랜섬웨어 감염 시 자동 대응 플레이북",
      steps: 8,
      avgDuration: "5분",
      category: "malware",
      priority: "CRITICAL",
      enabled: true,
      executions: 12,
      successRate: 95.8,
    },
    {
      id: "playbook-002",
      name: "APT Detection Response",
      description: "고급 지속 위협 탐지 시 대응 절차",
      steps: 12,
      avgDuration: "15분",
      category: "apt",
      priority: "HIGH",
      enabled: true,
      executions: 7,
      successRate: 89.2,
    },
    {
      id: "playbook-003",
      name: "Insider Threat Mitigation",
      description: "내부자 위협 완화 절차",
      steps: 6,
      avgDuration: "8분",
      category: "insider",
      priority: "MEDIUM",
      enabled: false,
      executions: 3,
      successRate: 92.1,
    },
  ],
  recentActivity: [
    {
      timestamp: "15:45:23",
      action: "자동 호스트 격리",
      target: "WS-PROD-045",
      status: "SUCCESS",
    },
    {
      timestamp: "15:44:12",
      action: "프로세스 종료",
      target: "SRV-WEB-023",
      status: "SUCCESS",
    },
    {
      timestamp: "15:43:08",
      action: "네트워크 차단",
      target: "외부IP-192.168.1.100",
      status: "SUCCESS",
    },
  ],
  autoResponseLogs: [
    {
      id: "auto-001",
      timestamp: "2024-12-20 15:42:18",
      threat: "Ransomware Detection",
      target: "WS-PROD-045",
      severity: "CRITICAL",
      aiConfidence: 96.8,
      action: "HOST_ISOLATION",
      actionReason: "악성 암호화 활동 탐지 및 측면 이동 위험성",
      ruleMatched: "RULE-RANSOMWARE-001",
      responseTime: "0.8초",
      status: "SUCCESS",
      impact: "호스트 격리 완료, 추가 피해 차단",
      followupRequired: false,
      mitreId: "T1486",
      evidenceFiles: ["encrypt.exe", "ransom.txt", "shadow_delete.bat"],
    },
    {
      id: "auto-002",
      timestamp: "2024-12-20 15:38:45",
      threat: "Lateral Movement Attempt",
      target: "SRV-DB-012",
      severity: "HIGH",
      aiConfidence: 89.3,
      action: "NETWORK_BLOCK",
      actionReason: "비정상적인 네트워크 연결 패턴 및 권한 상승 시도",
      ruleMatched: "RULE-LATERAL-MOVEMENT-003",
      responseTime: "1.2초",
      status: "SUCCESS",
      impact: "측면 이동 차단, 추가 시스템 침해 방지",
      followupRequired: false,
      mitreId: "T1021",
      evidenceFiles: ["psexec.exe", "net_commands.log"],
    },
    {
      id: "auto-003",
      timestamp: "2024-12-20 15:35:12",
      threat: "Process Injection",
      target: "WS-ADMIN-003",
      severity: "MEDIUM",
      aiConfidence: 82.1,
      action: "PROCESS_KILL",
      actionReason: "DLL 인젝션 패턴 탐지, 메모리 조작 시도",
      ruleMatched: "RULE-PROCESS-INJECTION-002",
      responseTime: "0.5초",
      status: "SUCCESS",
      impact: "악성 프로세스 종료, 시스템 안정성 유지",
      followupRequired: true,
      mitreId: "T1055",
      evidenceFiles: ["injected.dll", "memory_dump.bin"],
    },
  ],
  manualActionRequired: [
    {
      id: "manual-001",
      timestamp: "2024-12-20 15:40:33",
      threat: "Advanced Persistent Threat",
      target: "SRV-FILE-007",
      severity: "HIGH",
      aiConfidence: 67.4,
      whyNotAutomatic: "신뢰도 임계값 미달 (70% 미만)",
      riskAssessment: "복잡한 APT 공격 패턴, 오탐 가능성 존재",
      suggestedActions: [
        "상세 네트워크 트래픽 분석",
        "파일 시스템 무결성 검사",
        "사용자 계정 활동 로그 검토",
      ],
      priority: "HIGH",
      estimatedTimeToResolve: "30-45분",
      assignedTo: "보안팀",
      mitreId: "T1078",
      evidenceFiles: ["suspicious_login.log", "file_access.log"],
      aiRecommendation: "수동 조사 후 격리 여부 결정 권장",
    },
    {
      id: "manual-002",
      timestamp: "2024-12-20 15:35:21",
      threat: "Data Exfiltration Attempt",
      target: "WS-DEV-021",
      severity: "MEDIUM",
      aiConfidence: 74.2,
      whyNotAutomatic: "정책상 개발환경 자동차단 제한",
      riskAssessment: "개발 데이터 외부 전송, 업무 영향도 고려 필요",
      suggestedActions: [
        "전송 데이터 내용 확인",
        "사용자 의도 확인",
        "필요시 네트워크 제한 적용",
      ],
      priority: "MEDIUM",
      estimatedTimeToResolve: "15-20분",
      assignedTo: "IT팀",
      mitreId: "T1041",
      evidenceFiles: ["network_traffic.pcap", "file_transfer.log"],
      aiRecommendation: "사용자 확인 후 차단 여부 결정",
    },
    {
      id: "manual-003",
      timestamp: "2024-12-20 15:30:15",
      threat: "Privilege Escalation",
      target: "WS-FINANCE-012",
      severity: "HIGH",
      aiConfidence: 68.9,
      whyNotAutomatic: "금융 시스템 접근으로 오탐 영향도 높음",
      riskAssessment: "권한 상승 시도이나 정상 업무일 가능성 존재",
      suggestedActions: [
        "사용자 업무 패턴 확인",
        "권한 변경 이력 조사",
        "관리자 승인 하에 계정 제한",
      ],
      priority: "HIGH",
      estimatedTimeToResolve: "20-30분",
      assignedTo: "보안팀",
      mitreId: "T1548",
      evidenceFiles: ["privilege_change.log", "user_activity.log"],
      aiRecommendation: "즉시 조사 필요, 필요시 계정 일시 제한",
    },
  ],
};

export default function ResponsePage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "overview", label: "통계 현황" },
    { id: "incidents", label: "활성 위협" },
    { id: "autoLogs", label: "자동 대응" },
    { id: "manualRequired", label: "수동 검토" },
  ];

  const { isLoggedIn, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "text-red-500 bg-red-500/10 border-red-500/30";
      case "high":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "low":
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "responding":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "blocked":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30";
      case "investigating":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "contained":
        return "text-green-400 bg-green-500/10 border-green-500/30";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center relative">
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
                  auto-response://loading --threat-mitigation
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="text-cyan-400 font-mono text-sm mb-4">
                $ threat-response --load-playbooks --autonomous
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-4 h-4 border-2 border-cyan-500/50 border-t-cyan-500 rounded-full animate-spin"></div>
                <span className="text-slate-300 font-mono text-sm">
                  자동 대응 시스템 로딩 중...
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-slate-400">
                  {">"} Loading response playbooks
                </div>
                <div className="text-slate-400">
                  {">"} Initializing auto-isolation
                </div>
                <div className="text-slate-400">
                  {">"} Checking quarantine systems
                </div>
                <div className="text-cyan-400 animate-pulse">
                  {">"} Activating threat response...
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
              auto-response://threat-mitigation --real-time
            </span>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-4 text-sm font-mono mb-4">
              <span className="text-cyan-400">security@response:~$</span>
              <span className="text-slate-300">
                manage --automated-response --containment
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-cyan-400 font-mono mb-2">
                Automated Response System
              </h1>
              <p className="text-slate-400 font-mono text-sm">
                위협을 자동으로 차단하고 격리하는 시스템을 관리하세요
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
        >
          {[
            {
              label: "활성 위협",
              value: mockResponseData.statistics.activeThreats,
              color: "text-red-400",
              desc: "현재 대응 중",
            },
            {
              label: "자동 차단",
              value: mockResponseData.statistics.autoBlocked,
              color: "text-orange-400",
              desc: "24시간 내",
            },
            {
              label: "수동 조치",
              value: mockResponseData.statistics.manualActions,
              color: "text-yellow-400",
              desc: "수동 개입",
            },
            {
              label: "평균 대응시간",
              value: `${mockResponseData.statistics.avgResponseTime}초`,
              color: "text-green-400",
              desc: "자동 대응",
            },
            {
              label: "성공률",
              value: `${mockResponseData.statistics.successRate}%`,
              color: "text-blue-400",
              desc: "대응 성공",
            },
            {
              label: "격리 호스트",
              value: mockResponseData.statistics.isolatedHosts,
              color: "text-purple-400",
              desc: "현재 격리됨",
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
              <div className={`text-xl font-bold font-mono ${stat.color} mb-1`}>
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString()
                  : stat.value}
              </div>
              <div className="text-slate-500 text-xs font-mono">
                {stat.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden"
        >
          <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-slate-400 text-sm font-mono ml-2">
              response-navigator --tabs --configuration
            </span>
          </div>

          <div className="p-4">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-lg transition-all duration-200 font-mono text-sm ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/50 shadow-lg"
                      : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Response Types */}
              <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden">
                <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-slate-400 text-sm font-mono ml-2">
                    response-types --categories
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-orange-400 font-mono text-sm mb-4">
                    대응 유형별 통계
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockResponseData.responseTypes.map((type, index) => (
                      <motion.div
                        key={type.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-mono font-medium ${type.color}`}>
                            {type.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-sm font-mono">
                              {type.count}회
                            </span>
                            {type.automated && (
                              <span className="text-xs px-2 py-1 rounded border bg-green-500/10 border-green-500/30 text-green-400 font-mono">
                                AUTO
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${type.color.replace(
                              "text-",
                              "bg-"
                            )} rounded-full transition-all duration-500`}
                            style={{ width: `${(type.count / 40) * 100}%` }}
                          ></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden">
                <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-slate-400 text-sm font-mono ml-2">
                    activity-log --recent-responses
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-orange-400 font-mono text-sm mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                    최근 대응 활동
                  </h3>
                  <div className="space-y-2">
                    {mockResponseData.recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-3 bg-slate-800/30 rounded border border-slate-700/30"
                      >
                        <span className="text-slate-500 font-mono text-xs">
                          {activity.timestamp}
                        </span>
                        <span className="text-cyan-400 font-mono text-xs">
                          {activity.action}
                        </span>
                        <span className="text-slate-300 font-mono text-xs flex-1">
                          {activity.target}
                        </span>
                        <span className="text-orange-400 font-mono text-xs">
                          {activity.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "incidents" && (
            <motion.div
              key="incidents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                  incident-manager --active --real-time
                </span>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {mockResponseData.activeIncidents.map((incident, index) => (
                    <motion.div
                      key={incident.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() =>
                        setSelectedIncident(
                          selectedIncident?.id === incident.id ? null : incident
                        )
                      }
                      className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-slate-300 font-mono font-medium">
                            {incident.threat}
                          </h3>
                          {incident.autoResponse && (
                            <span className="text-xs px-2 py-1 rounded border bg-blue-500/10 border-blue-500/30 text-blue-400 font-mono">
                              AUTO
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded border font-mono ${getSeverityColor(
                              incident.severity
                            )}`}
                          >
                            {incident.severity}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded border font-mono ${getStatusColor(
                              incident.status
                            )}`}
                          >
                            {incident.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-sm font-mono mb-3">
                        {incident.description}
                      </p>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-4">
                          <span className="text-slate-400">
                            대상:{" "}
                            <span className="text-cyan-400">
                              {incident.target}
                            </span>
                          </span>
                          <span className="text-slate-400">
                            대응시간:{" "}
                            <span className="text-green-400">
                              {incident.responseTime}
                            </span>
                          </span>
                          <span className="text-slate-400">
                            MITRE:{" "}
                            <span className="text-purple-400">
                              {incident.mitreId}
                            </span>
                          </span>
                        </div>
                        <span className="text-slate-500">
                          탐지: {incident.detectedAt}
                        </span>
                      </div>

                      {selectedIncident?.id === incident.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-slate-700/50"
                        >
                          <div className="space-y-3">
                            <div>
                              <div className="text-slate-400 font-mono text-sm mb-2">
                                실행된 대응 조치
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {incident.actions.map(
                                  (action: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-1 rounded border bg-green-500/10 border-green-500/30 text-green-400 font-mono"
                                    >
                                      {action}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded text-blue-300 font-mono text-xs transition-colors">
                                상세 분석
                              </button>
                              <button className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded text-yellow-300 font-mono text-xs transition-colors">
                                수동 조치
                              </button>
                              <button className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded text-green-300 font-mono text-xs transition-colors">
                                격리 해제
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "autoLogs" && (
            <motion.div
              key="autoLogs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                  auto-response-logger --ai-decisions --execution-history
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-cyan-400 font-mono text-lg mb-4">
                  AI 자동대응 로그
                </h3>
                <div className="space-y-4">
                  {mockResponseData.autoResponseLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="text-blue-400 font-mono font-bold">
                            {log.threat}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded border font-mono ${
                              log.severity === "CRITICAL"
                                ? "text-red-400 bg-red-500/10 border-red-500/30"
                                : log.severity === "HIGH"
                                ? "text-orange-400 bg-orange-500/10 border-orange-500/30"
                                : "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
                            }`}
                          >
                            {log.severity}
                          </span>
                          <span className="text-green-400 bg-green-500/10 border border-green-500/30 text-xs px-2 py-1 rounded font-mono">
                            AUTO
                          </span>
                        </div>
                        <span className="text-slate-400 font-mono text-sm">
                          {log.timestamp}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-slate-400 font-mono text-xs mb-1">
                            대상 시스템
                          </div>
                          <div className="text-cyan-400 font-mono text-sm">
                            {log.target}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 font-mono text-xs mb-1">
                            AI 신뢰도
                          </div>
                          <div className="text-green-400 font-mono text-sm">
                            {log.aiConfidence}%
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 font-mono text-xs mb-1">
                            대응 시간
                          </div>
                          <div className="text-purple-400 font-mono text-sm">
                            {log.responseTime}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 font-mono text-xs mb-1">
                            적용 규칙
                          </div>
                          <div className="text-orange-400 font-mono text-sm">
                            {log.ruleMatched}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-slate-400 font-mono text-xs mb-2">
                          AI 대응 근거
                        </div>
                        <div className="text-slate-300 font-mono text-sm bg-slate-900/50 p-3 rounded border border-slate-600/30">
                          {log.actionReason}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-slate-400 font-mono text-xs mb-2">
                          대응 결과 및 영향
                        </div>
                        <div className="text-slate-300 font-mono text-sm bg-slate-900/50 p-3 rounded border border-slate-600/30">
                          {log.impact}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-slate-400 font-mono text-xs">
                            MITRE ID:{" "}
                            <span className="text-red-400">{log.mitreId}</span>
                          </span>
                          <span className="text-slate-400 font-mono text-xs">
                            증거 파일:{" "}
                            <span className="text-blue-400">
                              {log.evidenceFiles.length}개
                            </span>
                          </span>
                        </div>
                        {log.followupRequired && (
                          <span className="text-xs px-2 py-1 rounded border bg-yellow-500/10 border-yellow-500/30 text-yellow-400 font-mono">
                            후속 조치 필요
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "manualRequired" && (
            <motion.div
              key="manualRequired"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                  manual-intervention --pending-actions --analyst-required
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-cyan-400 font-mono text-lg">
                    수동 대응 필요 항목
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 font-mono text-sm">
                      {mockResponseData.manualActionRequired.length}건 대기
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockResponseData.manualActionRequired.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 border-l-4 border-l-orange-500"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="text-orange-400 font-mono font-bold">
                            {item.threat}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded border font-mono ${
                              item.priority === "HIGH"
                                ? "text-red-400 bg-red-500/10 border-red-500/30"
                                : "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
                            }`}
                          >
                            {item.priority}
                          </span>
                          <span className="text-orange-400 bg-orange-500/10 border border-orange-500/30 text-xs px-2 py-1 rounded font-mono">
                            MANUAL
                          </span>
                        </div>
                        <span className="text-slate-400 font-mono text-sm">
                          {item.timestamp}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-slate-400 font-mono text-xs mb-1">
                            대상 시스템
                          </div>
                          <div className="text-cyan-400 font-mono text-sm">
                            {item.target}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 font-mono text-xs mb-1">
                            AI 신뢰도
                          </div>
                          <div className="text-yellow-400 font-mono text-sm">
                            {item.aiConfidence}% (임계값 미달)
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 font-mono text-xs mb-1">
                            예상 처리시간
                          </div>
                          <div className="text-purple-400 font-mono text-sm">
                            {item.estimatedTimeToResolve}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-slate-400 font-mono text-xs mb-2">
                          자동대응 불가 사유
                        </div>
                        <div className="text-red-300 font-mono text-sm bg-red-500/5 p-3 rounded border border-red-500/20">
                          {item.whyNotAutomatic}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-slate-400 font-mono text-xs mb-2">
                          위험 평가
                        </div>
                        <div className="text-slate-300 font-mono text-sm bg-slate-900/50 p-3 rounded border border-slate-600/30">
                          {item.riskAssessment}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-slate-400 font-mono text-xs mb-2">
                          AI 권장 대응 방안
                        </div>
                        <div className="space-y-2">
                          {item.suggestedActions.map((action, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-green-400">•</span>
                              <span className="text-slate-300 font-mono text-sm">
                                {action}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-slate-400 font-mono text-xs mb-2">
                          AI 최종 권고사항
                        </div>
                        <div className="text-blue-300 font-mono text-sm bg-blue-500/5 p-3 rounded border border-blue-500/20">
                          {item.aiRecommendation}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-slate-400 font-mono text-xs">
                            담당:{" "}
                            <span className="text-cyan-400">
                              {item.assignedTo}
                            </span>
                          </span>
                          <span className="text-slate-400 font-mono text-xs">
                            MITRE ID:{" "}
                            <span className="text-red-400">{item.mitreId}</span>
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded text-green-300 font-mono text-xs transition-colors">
                            승인 후 자동실행
                          </button>
                          <button className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded text-blue-300 font-mono text-xs transition-colors">
                            상세 조사
                          </button>
                          <button className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded text-red-300 font-mono text-xs transition-colors">
                            거부
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
