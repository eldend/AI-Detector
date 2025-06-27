"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

// Mock data for demonstration
const mockPolicyData = {
  detectionRules: [
    {
      id: 1,
      name: "의심스러운 프로세스 실행",
      category: "Process",
      severity: "High",
      enabled: true,
      threshold: 0.8,
      description: "알려지지 않은 프로세스의 비정상적인 실행 패턴 탐지",
      lastModified: "2024-06-20",
    },
    {
      id: 2,
      name: "비정상적인 네트워크 트래픽",
      category: "Network",
      severity: "Medium",
      enabled: true,
      threshold: 0.7,
      description: "예상 범위를 벗어난 네트워크 활동 탐지",
      lastModified: "2024-06-19",
    },
    {
      id: 3,
      name: "레지스트리 변경 감지",
      category: "Registry",
      severity: "High",
      enabled: false,
      threshold: 0.9,
      description: "중요 시스템 레지스트리 키의 무단 변경 탐지",
      lastModified: "2024-06-18",
    },
  ],
  alertSettings: {
    emailNotifications: true,
    slackIntegration: false,
    thresholdLevel: "Medium",
    recipients: ["admin@company.com", "security@company.com"],
    alertFrequency: "Immediate",
  },
  systemSettings: {
    logRetention: 30,
    indexSettings: {
      shards: 3,
      replicas: 1,
      refreshInterval: "1s",
    },
    performanceMode: "Balanced",
    autoScaling: true,
  },
  userRoles: [
    {
      id: 1,
      name: "Administrator",
      permissions: ["read", "write", "delete", "manage_users"],
      userCount: 2,
      description: "전체 시스템 관리 권한",
    },
    {
      id: 2,
      name: "Security Analyst",
      permissions: ["read", "write"],
      userCount: 5,
      description: "보안 분석 및 정책 수정 권한",
    },
    {
      id: 3,
      name: "Viewer",
      permissions: ["read"],
      userCount: 12,
      description: "읽기 전용 권한",
    },
  ],
};

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState("rules");
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [showRuleModal, setShowRuleModal] = useState(false);

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
    { id: "rules", label: "탐지 규칙" },
    { id: "alerts", label: "알림 설정" },
    { id: "access", label: "접근 제어" },
    { id: "system", label: "시스템 설정" },
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
          <p className="text-app-text">정책 설정 로딩 중...</p>
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
            보안 정책 관리
          </h1>
          <p className="text-app-secondary">
            이상 탐지 규칙, 알림 설정 및 시스템 보안 정책 관리
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
            {activeTab === "rules" && (
              <motion.div
                key="rules"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <DetectionRules
                  rules={mockPolicyData.detectionRules}
                  onEditRule={setEditingRule}
                  onShowModal={() => setShowRuleModal(true)}
                />
              </motion.div>
            )}

            {activeTab === "alerts" && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <AlertSettings settings={mockPolicyData.alertSettings} />
              </motion.div>
            )}

            {activeTab === "access" && (
              <motion.div
                key="access"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <AccessControl roles={mockPolicyData.userRoles} />
              </motion.div>
            )}

            {activeTab === "system" && (
              <motion.div
                key="system"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <SystemSettings settings={mockPolicyData.systemSettings} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rule Edit Modal */}
        <AnimatePresence>
          {(showRuleModal || editingRule) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
              onClick={() => {
                setShowRuleModal(false);
                setEditingRule(null);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl p-8 min-w-[500px] max-w-2xl border-2 border-app-primary-200 relative max-h-[80vh] overflow-y-auto"
              >
                <RuleEditModal
                  rule={editingRule}
                  onClose={() => {
                    setShowRuleModal(false);
                    setEditingRule(null);
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

// Detection Rules Component
function DetectionRules({
  rules,
  onEditRule,
  onShowModal,
}: {
  rules: any[];
  onEditRule: (rule: any) => void;
  onShowModal: () => void;
}) {
  return (
    <div className="h-full space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-app-text">탐지 규칙 관리</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onShowModal}
          className="btn btn-primary"
        >
          + 새 규칙 추가
        </motion.button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule, index) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-app-text">
                    {rule.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      rule.severity === "High"
                        ? "bg-danger/20 text-danger"
                        : rule.severity === "Medium"
                        ? "bg-warning/20 text-warning"
                        : "bg-app-secondary/20 text-app-secondary"
                    }`}
                  >
                    {rule.severity}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs bg-app-primary/20 text-app-primary">
                    {rule.category}
                  </span>
                </div>
                <p className="text-app-secondary text-sm mb-2">
                  {rule.description}
                </p>
                <div className="flex items-center space-x-4 text-xs text-app-secondary">
                  <span>임계값: {rule.threshold}</span>
                  <span>수정일: {rule.lastModified}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    className="sr-only"
                    onChange={() => {}}
                  />
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      rule.enabled ? "bg-app-primary" : "bg-app-background-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        rule.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </div>
                </label>
                <button
                  onClick={() => onEditRule(rule)}
                  className="px-3 py-1 text-sm bg-app-background-100 hover:bg-app-primary-50 text-app-primary border border-app-primary-200 rounded-lg transition-colors"
                >
                  편집
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Alert Settings Component
function AlertSettings({ settings }: { settings: any }) {
  return (
    <div className="h-full space-y-6">
      <h2 className="text-xl font-semibold text-app-text">알림 설정</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-app-text mb-4">
            알림 채널
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-app-text">이메일 알림</p>
                <p className="text-sm text-app-secondary">
                  이상 탐지 시 이메일로 알림 발송
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  className="sr-only"
                />
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications
                      ? "bg-app-primary"
                      : "bg-app-background-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.emailNotifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-app-text">Slack 연동</p>
                <p className="text-sm text-app-secondary">
                  Slack 채널로 실시간 알림 전송
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.slackIntegration}
                  className="sr-only"
                />
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.slackIntegration
                      ? "bg-app-primary"
                      : "bg-app-background-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.slackIntegration
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Alert Thresholds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-app-text mb-4">
            알림 임계값
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-app-text mb-2">
                최소 심각도 수준
              </label>
              <select className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text">
                <option value="Low">Low</option>
                <option value="Medium" selected>
                  Medium
                </option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-app-text mb-2">
                알림 빈도
              </label>
              <select className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text">
                <option value="Immediate" selected>
                  즉시
                </option>
                <option value="Hourly">1시간마다</option>
                <option value="Daily">하루마다</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Recipients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-app-text mb-4">
            수신자 관리
          </h3>
          <div className="space-y-3">
            {settings.recipients.map((email: string, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-app-background-100 rounded-lg"
              >
                <span className="text-app-text">{email}</span>
                <button className="text-danger hover:text-danger/80 transition-colors">
                  제거
                </button>
              </div>
            ))}
            <button className="w-full p-3 border-2 border-dashed border-app-primary-200 rounded-lg text-app-primary hover:bg-app-primary-50 transition-colors">
              + 수신자 추가
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Access Control Component
function AccessControl({ roles }: { roles: any[] }) {
  return (
    <div className="h-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-app-text">접근 제어</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-primary"
        >
          + 새 역할 추가
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-app-text">
                {role.name}
              </h3>
              <span className="px-2 py-1 bg-app-primary/20 text-app-primary rounded-full text-sm">
                {role.userCount}명
              </span>
            </div>
            <p className="text-app-secondary text-sm mb-4">
              {role.description}
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-app-text">권한:</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((permission: string) => (
                  <span
                    key={permission}
                    className="px-2 py-1 bg-app-background-100 text-app-text rounded text-xs"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-1 text-sm bg-app-background-100 hover:bg-app-primary-50 text-app-primary border border-app-primary-200 rounded transition-colors">
                편집
              </button>
              <button className="px-3 py-1 text-sm text-danger hover:text-danger/80 transition-colors">
                삭제
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// System Settings Component
function SystemSettings({ settings }: { settings: any }) {
  return (
    <div className="h-full space-y-6">
      <h2 className="text-xl font-semibold text-app-text">시스템 설정</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OpenSearch Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-app-text mb-4">
            OpenSearch 설정
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-app-text mb-2">
                샤드 수
              </label>
              <input
                type="number"
                value={settings.indexSettings.shards}
                className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-app-text mb-2">
                복제본 수
              </label>
              <input
                type="number"
                value={settings.indexSettings.replicas}
                className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-app-text mb-2">
                새로고침 간격
              </label>
              <input
                type="text"
                value={settings.indexSettings.refreshInterval}
                className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text"
              />
            </div>
          </div>
        </motion.div>

        {/* Performance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-app-text mb-4">
            성능 설정
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-app-text mb-2">
                성능 모드
              </label>
              <select className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text">
                <option value="High Performance">고성능</option>
                <option value="Balanced" selected>
                  균형
                </option>
                <option value="Power Saving">절약</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-app-text">자동 스케일링</p>
                <p className="text-sm text-app-secondary">
                  로드에 따른 자동 리소스 조정
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoScaling}
                  className="sr-only"
                />
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoScaling
                      ? "bg-app-primary"
                      : "bg-app-background-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoScaling ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Data Retention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-app-text mb-4">
            데이터 보존 정책
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-app-text mb-2">
                로그 보존 기간 (일)
              </label>
              <input
                type="number"
                value={settings.logRetention}
                className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-app-text mb-2">
                백업 주기
              </label>
              <select className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text">
                <option value="Daily">매일</option>
                <option value="Weekly" selected>
                  매주
                </option>
                <option value="Monthly">매월</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-app-text mb-2">
                압축 방식
              </label>
              <select className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text">
                <option value="gzip" selected>
                  GZIP
                </option>
                <option value="lz4">LZ4</option>
                <option value="zstd">ZSTD</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Rule Edit Modal Component
function RuleEditModal({ rule, onClose }: { rule: any; onClose: () => void }) {
  const isEditing = !!rule;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-app-text">
          {isEditing ? "규칙 편집" : "새 규칙 추가"}
        </h3>
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
            규칙 이름
          </label>
          <input
            type="text"
            defaultValue={rule?.name || ""}
            className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text"
            placeholder="규칙 이름을 입력하세요"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-app-text mb-2">
              카테고리
            </label>
            <select
              defaultValue={rule?.category || ""}
              className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text"
            >
              <option value="Process">Process</option>
              <option value="Network">Network</option>
              <option value="Registry">Registry</option>
              <option value="File">File</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-app-text mb-2">
              심각도
            </label>
            <select
              defaultValue={rule?.severity || ""}
              className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-app-text mb-2">
            임계값 (0.0 - 1.0)
          </label>
          <input
            type="number"
            min="0"
            max="1"
            step="0.1"
            defaultValue={rule?.threshold || "0.7"}
            className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-app-text mb-2">
            설명
          </label>
          <textarea
            rows={3}
            defaultValue={rule?.description || ""}
            className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text"
            placeholder="규칙에 대한 설명을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-app-text mb-2">
            조건 쿼리 (Sigma 규칙)
          </label>
          <textarea
            rows={6}
            className="w-full px-3 py-2 border border-app-primary-200 rounded-lg bg-app-background-100 text-app-text font-mono text-sm"
            placeholder="title: Example Rule
detection:
  selection:
    EventID: 1
    Image|endswith: '.exe'
  condition: selection"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="enableRule"
            defaultChecked={rule?.enabled ?? true}
            className="rounded"
          />
          <label htmlFor="enableRule" className="text-app-text">
            규칙 활성화
          </label>
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
          {isEditing ? "저장" : "추가"}
        </motion.button>
      </div>
    </div>
  );
}
