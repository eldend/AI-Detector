"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

// Mock data for demonstration
const mockAnalysisData = {
  modelPerformance: {
    accuracy: 94.2,
    precision: 92.8,
    recall: 95.1,
    f1Score: 93.9,
  },
  trendsData: [
    { month: "Jan", anomalies: 23, normal: 156, accuracy: 94.2 },
    { month: "Feb", anomalies: 31, normal: 142, accuracy: 93.8 },
    { month: "Mar", anomalies: 28, normal: 168, accuracy: 95.1 },
    { month: "Apr", anomalies: 42, normal: 134, accuracy: 92.4 },
    { month: "May", anomalies: 36, normal: 159, accuracy: 94.7 },
    { month: "Jun", anomalies: 29, normal: 171, accuracy: 95.3 },
  ],
  featureImportance: [
    { feature: "Network Traffic", importance: 87.3, color: "#4a5568" },
    { feature: "CPU Usage", importance: 76.8, color: "#718096" },
    { feature: "Memory Usage", importance: 64.2, color: "#a2b2c1" },
    { feature: "Disk I/O", importance: 59.1, color: "#cbd5e0" },
    { feature: "User Activity", importance: 45.6, color: "#e2e8f0" },
  ],
  correlationMatrix: [
    { var1: "CPU", var2: "Memory", correlation: 0.73 },
    { var1: "CPU", var2: "Network", correlation: 0.45 },
    { var1: "Memory", var2: "Disk", correlation: 0.62 },
    { var1: "Network", var2: "User", correlation: 0.38 },
  ],
};

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState("performance");
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("accuracy");

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
    { id: "performance", label: "모델 성능" },
    { id: "trends", label: "트렌드 분석" },
    { id: "features", label: "변수 중요도" },
    { id: "correlation", label: "상관관계" },
  ];

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center relative">
        {/* Tech Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* 3D Floating Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-72 h-72 rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)",
              left: "10%",
              top: "15%",
              animation: "float 20s ease-in-out infinite",
              zIndex: -1,
            }}
          ></div>
          <div
            className="absolute w-96 h-96 rounded-full opacity-25"
            style={{
              background:
                "radial-gradient(circle at 25% 25%, rgba(168, 85, 247, 0.35) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 70%)",
              right: "5%",
              top: "5%",
              animation: "float 25s ease-in-out infinite reverse",
              zIndex: -1,
            }}
          ></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Terminal Loading Window */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-lg border border-slate-700/50 overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/70 border-b border-slate-700/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-slate-400 text-sm font-mono">
                  analytics-engine.terminal
                </span>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6">
              <div className="text-green-400 font-mono text-sm mb-4">
                $ analytics-engine --process --ml-models
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-4 h-4 border-2 border-violet-400/50 border-t-violet-400 rounded-full animate-spin"></div>
                <span className="text-slate-300 font-mono text-sm">
                  분석 데이터 로딩 중...
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-slate-400">✓ Loading ML models</div>
                <div className="text-slate-400">
                  ✓ Processing analytics data
                </div>
                <div className="text-violet-400 animate-pulse">
                  → Generating performance metrics...
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translate(0, 0) rotate(0deg);
            }
            25% {
              transform: translate(30px, -30px) rotate(1deg);
            }
            50% {
              transform: translate(-20px, 20px) rotate(-1deg);
            }
            75% {
              transform: translate(20px, -10px) rotate(0.5deg);
            }
          }
        `}</style>
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
            고급 분석 대시보드
          </h1>
          <p className="text-app-secondary">
            LLM 모델 성능 및 데이터 패턴 심화 분석
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
            {activeTab === "performance" && (
              <motion.div
                key="performance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <PerformanceAnalysis data={mockAnalysisData.modelPerformance} />
              </motion.div>
            )}

            {activeTab === "trends" && (
              <motion.div
                key="trends"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <TrendsAnalysis
                  data={mockAnalysisData.trendsData}
                  selectedMetric={selectedMetric}
                  onMetricChange={setSelectedMetric}
                />
              </motion.div>
            )}

            {activeTab === "features" && (
              <motion.div
                key="features"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <FeatureImportance data={mockAnalysisData.featureImportance} />
              </motion.div>
            )}

            {activeTab === "correlation" && (
              <motion.div
                key="correlation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <CorrelationAnalysis
                  data={mockAnalysisData.correlationMatrix}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Performance Analysis Component
function PerformanceAnalysis({ data }: { data: any }) {
  const metrics = [
    {
      key: "accuracy",
      label: "정확도",
      value: data.accuracy,
      color: "text-app-primary",
      bg: "bg-app-primary-100",
    },
    {
      key: "precision",
      label: "정밀도",
      value: data.precision,
      color: "text-app-secondary",
      bg: "bg-app-secondary-100",
    },
    {
      key: "recall",
      label: "재현율",
      value: data.recall,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      key: "f1Score",
      label: "F1 점수",
      value: data.f1Score,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div className="h-full space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-10 h-10 rounded-lg ${metric.bg} flex items-center justify-center`}
              >
                <div
                  className={`w-5 h-5 rounded-full ${metric.color} bg-current opacity-80`}
                ></div>
              </div>
              <div className="text-right">
                <p
                  className={`text-2xl font-bold ${metric.color} leading-none`}
                >
                  {metric.value}%
                </p>
                <h3 className="text-xs text-app-secondary mt-1">
                  {metric.label}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-app-text mb-4">ROC 커브</h3>
          <div className="h-64 bg-app-background-100 rounded-lg border-2 border-dashed border-app-primary-200 flex items-center justify-center">
            <div className="text-center text-app-secondary">
              <p>ROC 커브 차트</p>
              <p className="text-xs mt-1">AUC: 0.92</p>
            </div>
          </div>
        </motion.div>

        {/* Confusion Matrix */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-app-text mb-4">
            혼동 행렬
          </h3>
          <div className="grid grid-cols-3 gap-2 max-w-md">
            <div></div>
            <div className="text-center text-sm text-app-secondary font-medium">
              예측: Normal
            </div>
            <div className="text-center text-sm text-app-secondary font-medium">
              예측: Anomaly
            </div>

            <div className="text-sm text-app-secondary font-medium">
              실제: Normal
            </div>
            <div className="bg-app-secondary-100 p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-app-secondary">847</div>
              <div className="text-xs text-app-secondary">True Negative</div>
            </div>
            <div className="bg-warning/10 p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-warning">23</div>
              <div className="text-xs text-warning">False Positive</div>
            </div>

            <div className="text-sm text-app-secondary font-medium">
              실제: Anomaly
            </div>
            <div className="bg-danger/10 p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-danger">18</div>
              <div className="text-xs text-danger">False Negative</div>
            </div>
            <div className="bg-app-primary-100 p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-app-primary">156</div>
              <div className="text-xs text-app-primary">True Positive</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Trends Analysis Component
function TrendsAnalysis({
  data,
  selectedMetric,
  onMetricChange,
}: {
  data: any[];
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
}) {
  const metrics = [
    { key: "anomalies", label: "이상 탐지 건수", color: "#ef4444" },
    { key: "accuracy", label: "정확도", color: "#4a5568" },
    { key: "normal", label: "정상 건수", color: "#10b981" },
  ];

  return (
    <div className="h-full space-y-6">
      {/* Metric Selector */}
      <div className="flex space-x-2">
        {metrics.map((metric) => (
          <button
            key={metric.key}
            onClick={() => onMetricChange(metric.key)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedMetric === metric.key
                ? "bg-app-primary text-white"
                : "bg-app-background-600 text-app-secondary hover:bg-app-background-700"
            }`}
          >
            {metric.label}
          </button>
        ))}
      </div>

      {/* Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-app-text mb-4">
          {metrics.find((m) => m.key === selectedMetric)?.label} 트렌드
        </h3>
        <div className="h-64 bg-app-background-100 rounded-lg border-2 border-dashed border-app-primary-200 flex items-center justify-center">
          <div className="text-center text-app-secondary">
            <p>시계열 차트</p>
            <p className="text-xs mt-1">6개월간 트렌드</p>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h4 className="text-sm text-app-secondary mb-2">
            이번 달 총 이상 탐지
          </h4>
          <p className="text-2xl font-bold text-danger">29건</p>
          <p className="text-xs text-app-secondary mt-1">전월 대비 -19.4%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h4 className="text-sm text-app-secondary mb-2">평균 정확도</h4>
          <p className="text-2xl font-bold text-app-primary">94.2%</p>
          <p className="text-xs text-app-secondary mt-1">지난 6개월</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h4 className="text-sm text-app-secondary mb-2">최고 정확도</h4>
          <p className="text-2xl font-bold text-success">95.3%</p>
          <p className="text-xs text-app-secondary mt-1">6월 달성</p>
        </motion.div>
      </div>
    </div>
  );
}

// Feature Importance Component
function FeatureImportance({ data }: { data: any[] }) {
  return (
    <div className="h-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-app-text mb-4">
          변수 중요도 순위
        </h3>
        <div className="space-y-4">
          {data.map((feature, index) => (
            <motion.div
              key={feature.feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="w-8 h-8 rounded-full bg-app-primary-100 flex items-center justify-center text-sm font-semibold text-app-primary">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-app-text">
                    {feature.feature}
                  </span>
                  <span className="text-sm text-app-secondary">
                    {feature.importance}%
                  </span>
                </div>
                <div className="w-full bg-app-background-100 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${feature.importance}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: feature.color }}
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-app-text mb-4">특성 분석</h3>
        <div className="h-48 bg-app-background-100 rounded-lg border-2 border-dashed border-app-primary-200 flex items-center justify-center">
          <div className="text-center text-app-secondary">
            <p>특성 분포 차트</p>
            <p className="text-xs mt-1">변수별 기여도 시각화</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Correlation Analysis Component
function CorrelationAnalysis({ data }: { data: any[] }) {
  return (
    <div className="h-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-app-text mb-4">
          변수 간 상관관계
        </h3>
        <div className="h-64 bg-app-background-100 rounded-lg border-2 border-dashed border-app-primary-200 flex items-center justify-center">
          <div className="text-center text-app-secondary">
            <p>상관관계 히트맵</p>
            <p className="text-xs mt-1">변수 간 연관성 매트릭스</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-app-text mb-4">
          주요 상관관계
        </h3>
        <div className="space-y-3">
          {data.map((correlation, index) => (
            <motion.div
              key={`${correlation.var1}-${correlation.var2}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-app-background-100 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-app-text">
                  {correlation.var1} ↔ {correlation.var2}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-app-background-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-app-primary"
                    style={{
                      width: `${Math.abs(correlation.correlation) * 100}%`,
                    }}
                  ></div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    correlation.correlation > 0.5
                      ? "text-app-primary"
                      : correlation.correlation > 0.3
                      ? "text-warning"
                      : "text-app-secondary"
                  }`}
                >
                  {correlation.correlation.toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
