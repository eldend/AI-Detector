"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

// Mock data for demonstration
const mockResponseData = {
  activeIncidents: [
    {
      id: 1,
      title: "의심스러운 PowerShell 실행",
      description: "인코딩된 명령어로 PowerShell 실행 감지",
      severity: "Critical",
      status: "Open",
      assignee: "김보안",
      hostAffected: "HOST-3",
      detectedAt: "2024-06-22 14:30:25",
      lastActivity: "2분 전",
      sigmaRules: ["T1059.001", "T1112"],
      anomalyScore: 0.92,
    },
    {
      id: 2,
      title: "비정상적인 네트워크 연결",
      description: "알려지지 않은 외부 IP로의 대량 데이터 전송",
      severity: "High",
      status: "In Progress",
      assignee: "이분석",
      hostAffected: "HOST-7",
      detectedAt: "2024-06-22 14:15:10",
      lastActivity: "15분 전",
      sigmaRules: ["T1041"],
      anomalyScore: 0.87,
    },
    {
      id: 3,
      title: "레지스트리 변경 감지",
      description: "자동 시작 프로그램 등록 시도",
      severity: "Medium",
      status: "Open",
      assignee: "박모니터",
      hostAffected: "HOST-1",
      detectedAt: "2024-06-22 13:45:33",
      lastActivity: "45분 전",
      sigmaRules: ["T1112"],
      anomalyScore: 0.73,
    },
  ],
  responseActions: [
    {
      id: 1,
      type: "isolation",
      name: "호스트 격리",
      description: "감염된 호스트를 네트워크에서 격리",
      automated: true,
      icon: "🔒",
    },
    {
      id: 2,
      type: "process_kill",
      name: "프로세스 종료",
      description: "의심스러운 프로세스 강제 종료",
      automated: true,
      icon: "⛔",
    },
    {
      id: 3,
      type: "network_block",
      name: "네트워크 차단",
      description: "특정 IP 또는 도메인 차단",
      automated: false,
      icon: "🚫",
    },
    {
      id: 4,
      type: "file_quarantine",
      name: "파일 격리",
      description: "악성 파일을 안전한 위치로 이동",
      automated: true,
      icon: "📦",
    },
  ],
  responseMetrics: {
    mttr: 23.5, // minutes
    resolvedToday: 12,
    activeIncidents: 3,
    successRate: 94.2,
    automationRate: 67.8,
  },
  recentActions: [
    {
      id: 1,
      action: "호스트 격리",
      target: "HOST-5",
      user: "김보안",
      timestamp: "2024-06-22 14:25:00",
      status: "Success",
      duration: "2분",
    },
    {
      id: 2,
      action: "프로세스 종료",
      target: "malware.exe",
      user: "자동시스템",
      timestamp: "2024-06-22 14:20:15",
      status: "Success",
      duration: "1분",
    },
    {
      id: 3,
      action: "네트워크 차단",
      target: "185.129.62.55",
      user: "이분석",
      timestamp: "2024-06-22 14:10:30",
      status: "Success",
      duration: "3분",
    },
  ],
  playbooks: [
    {
      id: 1,
      name: "악성코드 감염 대응",
      description: "악성코드 감염 시 표준 대응 절차",
      steps: 5,
      estimatedTime: "15분",
      category: "Malware",
    },
    {
      id: 2,
      name: "데이터 유출 대응",
      description: "민감한 데이터 유출 시 대응 절차",
      steps: 8,
      estimatedTime: "30분",
      category: "Data Breach",
    },
    {
      id: 3,
      name: "내부자 위협 대응",
      description: "내부 사용자의 비정상 행위 대응",
      steps: 6,
      estimatedTime: "45분",
      category: "Insider Threat",
    },
  ],
};

export default function ResponsePage() {
  const [activeTab, setActiveTab] = useState("incidents");
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  const { isLoggedIn, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const tabs = [
    { id: "incidents", label: "활성 인시던트" },
    { id: "actions", label: "대응 조치" },
    { id: "playbooks", label: "대응 플레이북" },
    { id: "metrics", label: "성과 지표" },
  ];

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-app-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-app-primary-200 border-t-app-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-app-text">대응 시스템 로딩 중...</p>
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
    <DashboardLayout onLogout={handleLogout}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-app-text mb-2">
            인시던트 대응 센터
          </h1>
          <p className="text-app-secondary">
            실시간 위협 대응 및 인시던트 관리 시스템
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
        >
          <div className="card text-center">
            <div className="text-2xl font-bold text-danger mb-1">
              {mockResponseData.responseMetrics.activeIncidents}
            </div>
            <div className="text-xs text-app-secondary">활성 인시던트</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-app-primary mb-1">
              {mockResponseData.responseMetrics.resolvedToday}
            </div>
            <div className="text-xs text-app-secondary">오늘 해결</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {mockResponseData.responseMetrics.mttr}분
            </div>
            <div className="text-xs text-app-secondary">평균 해결시간</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-app-secondary mb-1">
              {mockResponseData.responseMetrics.successRate}%
            </div>
            <div className="text-xs text-app-secondary">성공률</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {mockResponseData.responseMetrics.automationRate}%
            </div>
            <div className="text-xs text-app-secondary">자동화율</div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-app-background-600 p-1 rounded-xl border border-app-primary-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-app-primary text-white shadow-md"
                    : "text-app-secondary hover:text-app-text hover:bg-app-background-700"
                }`}
              >
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {activeTab === "incidents" && (
              <motion.div
                key="incidents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ActiveIncidents
                  incidents={mockResponseData.activeIncidents}
                  onSelectIncident={setSelectedIncident}
                />
              </motion.div>
            )}

            {activeTab === "actions" && (
              <motion.div
                key="actions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ResponseActions
                  actions={mockResponseData.responseActions}
                  recentActions={mockResponseData.recentActions}
                  onShowActionModal={() => setShowActionModal(true)}
                />
              </motion.div>
            )}

            {activeTab === "playbooks" && (
              <motion.div
                key="playbooks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ResponsePlaybooks playbooks={mockResponseData.playbooks} />
              </motion.div>
            )}

            {activeTab === "metrics" && (
              <motion.div
                key="metrics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ResponseMetrics metrics={mockResponseData.responseMetrics} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Incident Detail Modal */}
        <AnimatePresence>
          {selectedIncident && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
              onClick={() => setSelectedIncident(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl p-8 min-w-[600px] max-w-4xl border-2 border-app-primary-200 relative max-h-[80vh] overflow-y-auto"
              >
                <IncidentDetailModal
                  incident={selectedIncident}
                  onClose={() => setSelectedIncident(null)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Modal */}
        <AnimatePresence>
          {showActionModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
              onClick={() => setShowActionModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl p-8 min-w-[500px] max-w-2xl border-2 border-app-primary-200 relative max-h-[80vh] overflow-y-auto"
              >
                <ActionModal onClose={() => setShowActionModal(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

// Active Incidents Component
function ActiveIncidents({
  incidents,
  onSelectIncident,
}: {
  incidents: any[];
  onSelectIncident: (incident: any) => void;
}) {
  return (
    <div className="h-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-app-text">활성 인시던트</h2>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text text-sm">
            <option>모든 심각도</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select className="px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text text-sm">
            <option>모든 상태</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {incidents.map((incident, index) => (
          <motion.div
            key={incident.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => onSelectIncident(incident)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-app-text">
                    {incident.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      incident.severity === "Critical"
                        ? "bg-danger/20 text-danger"
                        : incident.severity === "High"
                        ? "bg-warning/20 text-warning"
                        : "bg-app-secondary/20 text-app-secondary"
                    }`}
                  >
                    {incident.severity}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      incident.status === "Open"
                        ? "bg-danger/20 text-danger"
                        : incident.status === "In Progress"
                        ? "bg-warning/20 text-warning"
                        : "bg-success/20 text-success"
                    }`}
                  >
                    {incident.status}
                  </span>
                </div>
                <p className="text-app-secondary text-sm mb-3">
                  {incident.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-app-secondary">
                  <div>
                    <span className="font-medium">담당자:</span>{" "}
                    {incident.assignee}
                  </div>
                  <div>
                    <span className="font-medium">영향 호스트:</span>{" "}
                    {incident.hostAffected}
                  </div>
                  <div>
                    <span className="font-medium">탐지 시간:</span>{" "}
                    {incident.detectedAt}
                  </div>
                  <div>
                    <span className="font-medium">마지막 활동:</span>{" "}
                    {incident.lastActivity}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div
                  className={`text-2xl font-bold ${
                    incident.anomalyScore >= 0.9
                      ? "text-danger"
                      : incident.anomalyScore >= 0.7
                      ? "text-warning"
                      : "text-app-secondary"
                  }`}
                >
                  {(incident.anomalyScore * 100).toFixed(0)}%
                </div>
                <div className="flex flex-wrap gap-1">
                  {incident.sigmaRules.map((rule: string) => (
                    <span
                      key={rule}
                      className="px-2 py-1 bg-app-primary/20 text-app-primary rounded text-xs"
                    >
                      {rule}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Response Actions Component
function ResponseActions({
  actions,
  recentActions,
  onShowActionModal,
}: {
  actions: any[];
  recentActions: any[];
  onShowActionModal: () => void;
}) {
  return (
    <div className="h-full space-y-6">
      {/* Available Actions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-app-text">
            사용 가능한 대응 조치
          </h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onShowActionModal}
            className="btn btn-primary"
          >
            + 수동 조치 실행
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{action.icon}</div>
                <h3 className="text-lg font-semibold text-app-text mb-2">
                  {action.name}
                </h3>
                <p className="text-app-secondary text-sm mb-4">
                  {action.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      action.automated
                        ? "bg-success/20 text-success"
                        : "bg-warning/20 text-warning"
                    }`}
                  >
                    {action.automated ? "자동" : "수동"}
                  </span>
                  <button className="px-3 py-1 text-sm bg-app-primary text-white rounded hover:bg-app-primary-600 transition-colors">
                    실행
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Actions */}
      <div>
        <h3 className="text-lg font-semibold text-app-text mb-4">
          최근 대응 기록
        </h3>
        <div className="space-y-3">
          {recentActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-app-background-100 rounded-lg border border-app-primary-200"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    action.status === "Success" ? "bg-success" : "bg-danger"
                  }`}
                ></div>
                <div>
                  <div className="font-medium text-app-text">
                    {action.action} → {action.target}
                  </div>
                  <div className="text-sm text-app-secondary">
                    {action.user} • {action.timestamp}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-app-text">
                  {action.duration}
                </div>
                <div
                  className={`text-xs ${
                    action.status === "Success" ? "text-success" : "text-danger"
                  }`}
                >
                  {action.status}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Response Playbooks Component
function ResponsePlaybooks({ playbooks }: { playbooks: any[] }) {
  return (
    <div className="h-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-app-text">대응 플레이북</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-primary"
        >
          + 새 플레이북 생성
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playbooks.map((playbook, index) => (
          <motion.div
            key={playbook.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-app-text">
                {playbook.name}
              </h3>
              <span className="px-2 py-1 bg-app-primary/20 text-app-primary rounded-full text-sm">
                {playbook.category}
              </span>
            </div>
            <p className="text-app-secondary text-sm mb-4">
              {playbook.description}
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-app-secondary">단계:</span>
                <span className="text-app-text">{playbook.steps}개</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-app-secondary">예상 시간:</span>
                <span className="text-app-text">{playbook.estimatedTime}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-app-primary text-white rounded hover:bg-app-primary-600 transition-colors">
                실행
              </button>
              <button className="px-3 py-2 text-sm bg-app-background-100 hover:bg-app-primary-50 text-app-primary border border-app-primary-200 rounded transition-colors">
                편집
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Response Metrics Component
function ResponseMetrics({ metrics }: { metrics: any }) {
  return (
    <div className="h-full space-y-6">
      <h2 className="text-xl font-semibold text-app-text">대응 성과 지표</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MTTR Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-app-text mb-4">
            평균 해결 시간 (MTTR) 추이
          </h3>
          <div className="h-64 bg-app-background-100 rounded-lg border-2 border-dashed border-app-primary-200 flex items-center justify-center">
            <div className="text-center text-app-secondary">
              <p>MTTR 추이 차트</p>
              <p className="text-xs mt-1">지난 30일간 평균: {metrics.mttr}분</p>
            </div>
          </div>
        </motion.div>

        {/* Success Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-app-text mb-4">
            대응 성공률
          </h3>
          <div className="h-64 bg-app-background-100 rounded-lg border-2 border-dashed border-app-primary-200 flex items-center justify-center">
            <div className="text-center text-app-secondary">
              <p>성공률 도넛 차트</p>
              <p className="text-xs mt-1">
                현재 성공률: {metrics.successRate}%
              </p>
            </div>
          </div>
        </motion.div>

        {/* Automation Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-app-text mb-4">
            자동화 현황
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-app-background-100 rounded-lg">
              <div className="text-2xl font-bold text-app-primary mb-2">
                {metrics.automationRate}%
              </div>
              <div className="text-sm text-app-secondary">자동화율</div>
            </div>
            <div className="text-center p-4 bg-app-background-100 rounded-lg">
              <div className="text-2xl font-bold text-success mb-2">
                {Math.round(
                  metrics.resolvedToday * (metrics.automationRate / 100)
                )}
              </div>
              <div className="text-sm text-app-secondary">자동 해결</div>
            </div>
            <div className="text-center p-4 bg-app-background-100 rounded-lg">
              <div className="text-2xl font-bold text-warning mb-2">
                {metrics.resolvedToday -
                  Math.round(
                    metrics.resolvedToday * (metrics.automationRate / 100)
                  )}
              </div>
              <div className="text-sm text-app-secondary">수동 해결</div>
            </div>
            <div className="text-center p-4 bg-app-background-100 rounded-lg">
              <div className="text-2xl font-bold text-app-secondary mb-2">
                {Math.round(metrics.mttr * 0.6)}분
              </div>
              <div className="text-sm text-app-secondary">자동 MTTR</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Incident Detail Modal Component
function IncidentDetailModal({
  incident,
  onClose,
}: {
  incident: any;
  onClose: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-app-text">인시던트 상세 정보</h3>
        <button
          onClick={onClose}
          className="text-app-secondary hover:text-app-text text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-app-text mb-1">
              제목
            </label>
            <p className="text-app-text">{incident.title}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-app-text mb-1">
              심각도
            </label>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                incident.severity === "Critical"
                  ? "bg-danger/20 text-danger"
                  : incident.severity === "High"
                  ? "bg-warning/20 text-warning"
                  : "bg-app-secondary/20 text-app-secondary"
              }`}
            >
              {incident.severity}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-app-text mb-1">
            설명
          </label>
          <p className="text-app-secondary">{incident.description}</p>
        </div>

        {/* Timeline */}
        <div>
          <label className="block text-sm font-medium text-app-text mb-3">
            타임라인
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-danger rounded-full"></div>
              <div>
                <div className="text-sm font-medium text-app-text">
                  인시던트 탐지
                </div>
                <div className="text-xs text-app-secondary">
                  {incident.detectedAt}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <div>
                <div className="text-sm font-medium text-app-text">
                  담당자 할당
                </div>
                <div className="text-xs text-app-secondary">
                  {incident.assignee}에게 할당됨
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-app-primary-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-app-secondary hover:text-app-text transition-colors"
          >
            닫기
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary"
          >
            대응 조치 실행
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Action Modal Component
function ActionModal({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-app-text">수동 대응 조치</h3>
        <button
          onClick={onClose}
          className="text-app-secondary hover:text-app-text text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-app-text mb-2">
            조치 유형
          </label>
          <select className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text">
            <option>호스트 격리</option>
            <option>프로세스 종료</option>
            <option>네트워크 차단</option>
            <option>파일 격리</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-app-text mb-2">
            대상
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text"
            placeholder="호스트명, IP 주소, 프로세스명 등"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-app-text mb-2">
            사유
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text"
            placeholder="조치 사유를 입력하세요"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-app-primary-200">
        <button
          onClick={onClose}
          className="px-4 py-2 text-app-secondary hover:text-app-text transition-colors"
        >
          취소
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-primary"
        >
          실행
        </motion.button>
      </div>
    </div>
  );
}
