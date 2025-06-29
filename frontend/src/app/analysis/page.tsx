"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

// Mock data for RAG + LangGraph Analysis
const mockRAGData = {
  vectorDatabase: {
    documentsIndexed: 245892,
    embeddingDimensions: 1536,
    indexSize: "2.4GB",
    queryLatency: 23.5,
    retrievalAccuracy: 94.2,
    chunkSize: 512,
  },
  retrievalMetrics: [
    { time: "00:00", queries: 156, accuracy: 94.2, latency: 23.5 },
    { time: "04:00", queries: 189, accuracy: 93.8, latency: 25.1 },
    { time: "08:00", queries: 312, accuracy: 95.1, latency: 22.3 },
    { time: "12:00", queries: 428, accuracy: 92.4, latency: 28.7 },
    { time: "16:00", queries: 398, accuracy: 94.7, latency: 24.2 },
    { time: "20:00", queries: 267, accuracy: 95.3, latency: 21.8 },
  ],
  langGraphWorkflows: [
    {
      workflow: "Document Analysis",
      status: "running",
      executions: 1247,
      successRate: 96.8,
      avgDuration: 2.3,
    },
    {
      workflow: "Q&A Processing",
      status: "running",
      executions: 892,
      successRate: 94.2,
      avgDuration: 1.8,
    },
    {
      workflow: "Content Summarization",
      status: "paused",
      executions: 543,
      successRate: 98.1,
      avgDuration: 3.2,
    },
    {
      workflow: "Multi-Agent Research",
      status: "running",
      executions: 678,
      successRate: 91.5,
      avgDuration: 4.7,
    },
  ],
  agentPerformance: [
    {
      agent: "Retriever Agent",
      cpu: 45.2,
      memory: 2.1,
      tasks: 234,
      success: 97.3,
    },
    {
      agent: "Generator Agent",
      cpu: 78.4,
      memory: 4.8,
      tasks: 189,
      success: 94.7,
    },
    {
      agent: "Validator Agent",
      cpu: 23.1,
      memory: 1.2,
      tasks: 156,
      success: 99.1,
    },
    {
      agent: "Router Agent",
      cpu: 12.8,
      memory: 0.8,
      tasks: 423,
      success: 96.8,
    },
  ],
};

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState("rag");
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("queries");
  const [realTimeData, setRealTimeData] = useState({
    activeQueries: 0,
    vectorOperations: 0,
    workflowExecutions: 0,
  });

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

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        activeQueries: Math.floor(Math.random() * 50) + 20,
        vectorOperations: Math.floor(Math.random() * 200) + 100,
        workflowExecutions: Math.floor(Math.random() * 15) + 5,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const tabs = [
    { id: "rag", label: "RAG Performance" },
    { id: "workflows", label: "LangGraph Workflows" },
    { id: "agents", label: "Agent Orchestration" },
    { id: "vectors", label: "Vector Database" },
  ];

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center relative">
        {/* 3D Bubbles Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-xl animate-float-delay-1"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-green-500/15 to-blue-500/15 rounded-full blur-xl animate-float-delay-2"></div>
          <div className="absolute bottom-40 right-10 w-60 h-60 bg-gradient-to-br from-pink-500/20 to-yellow-500/20 rounded-full blur-xl animate-float-delay-3"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Terminal Loading Window */}
          <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-slate-400 text-sm font-mono">
                  rag-engine://langgraph-monitor --initializing
                </span>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6">
              <div className="text-cyan-400 font-mono text-sm mb-4">
                $ rag-analyzer --vectors --workflows --agents --real-time
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-4 h-4 border-2 border-cyan-500/50 border-t-cyan-500 rounded-full animate-spin"></div>
                <span className="text-slate-300 font-mono text-sm">
                  RAG + LangGraph 시스템 부팅 중...
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-slate-400">
                  ✓ Loading vector database connections
                </div>
                <div className="text-slate-400">
                  ✓ Initializing LangGraph workflows
                </div>
                <div className="text-slate-400">
                  ✓ Connecting agent orchestration layer
                </div>
                <div className="text-cyan-400 animate-pulse">
                  → Analyzing retrieval performance metrics...
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
      {/* 3D Bubbles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-xl animate-float-delay-1"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-green-500/15 to-blue-500/15 rounded-full blur-xl animate-float-delay-2"></div>
        <div className="absolute bottom-40 right-10 w-60 h-60 bg-gradient-to-br from-pink-500/20 to-yellow-500/20 rounded-full blur-xl animate-float-delay-3"></div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        {/* Terminal Header with Real-time Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden"
        >
          {/* Terminal Title Bar */}
          <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-slate-400 text-sm font-mono ml-2">
              rag-analytics://langgraph-dashboard --comprehensive --live
            </span>
          </div>

          {/* Command Interface */}
          <div className="p-4">
            <div className="flex items-center gap-4 text-sm font-mono mb-4">
              <span className="text-cyan-400">rag@langgraph:~$</span>
              <span className="text-slate-300">
                monitor --retrieval --workflows --agents --vectors
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-cyan-400 font-mono mb-2">
                  RAG + LangGraph Analytics Hub
                </h1>
                <p className="text-slate-400 font-mono text-sm">
                  검색 증강 생성 및 워크플로우 오케스트레이션 모니터링 시스템
                </p>
              </div>

              {/* Real-time Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-600/30">
                  <div className="text-xs text-slate-400 font-mono mb-1">
                    활성 쿼리
                  </div>
                  <div className="text-lg font-bold text-cyan-400 font-mono">
                    {realTimeData.activeQueries}
                  </div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-600/30">
                  <div className="text-xs text-slate-400 font-mono mb-1">
                    벡터 연산
                  </div>
                  <div className="text-lg font-bold text-green-400 font-mono">
                    {realTimeData.vectorOperations}/s
                  </div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-600/30">
                  <div className="text-xs text-slate-400 font-mono mb-1">
                    워크플로우
                  </div>
                  <div className="text-lg font-bold text-yellow-400 font-mono">
                    {realTimeData.workflowExecutions}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden"
        >
          <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-slate-400 text-sm font-mono ml-2">
              tab-navigator --rag --langgraph --agents --vectors
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

        {/* Content */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === "rag" && (
              <motion.div
                key="rag"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <RAGPerformance data={mockRAGData.vectorDatabase} />
              </motion.div>
            )}

            {activeTab === "workflows" && (
              <motion.div
                key="workflows"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <LangGraphWorkflows data={mockRAGData.langGraphWorkflows} />
              </motion.div>
            )}

            {activeTab === "agents" && (
              <motion.div
                key="agents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <AgentOrchestration data={mockRAGData.agentPerformance} />
              </motion.div>
            )}

            {activeTab === "vectors" && (
              <motion.div
                key="vectors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <VectorDatabase
                  data={mockRAGData.retrievalMetrics}
                  selectedMetric={selectedMetric}
                  onMetricChange={setSelectedMetric}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(71, 85, 105, 0.5) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(71, 85, 105, 0.5);
          border-radius: 3px;
          border: none;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(71, 85, 105, 0.7);
        }
      `}</style>
    </DashboardLayout>
  );
}

// RAG Performance Component
function RAGPerformance({ data }: { data: any }) {
  const metrics = [
    {
      key: "documentsIndexed",
      label: "인덱싱된 문서",
      value: data.documentsIndexed.toLocaleString(),
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
    },
    {
      key: "queryLatency",
      label: "검색 지연시간",
      value: `${data.queryLatency}ms`,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
    },
    {
      key: "retrievalAccuracy",
      label: "검색 정확도",
      value: `${data.retrievalAccuracy}%`,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
    },
    {
      key: "indexSize",
      label: "인덱스 크기",
      value: data.indexSize,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-slate-900/70 backdrop-blur-md border ${metric.border} rounded-lg p-4 hover:scale-105 transition-transform`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-12 h-12 rounded-lg ${metric.bg} flex items-center justify-center`}
              >
                <div
                  className={`w-6 h-6 rounded ${metric.color} bg-current`}
                ></div>
              </div>
              <div className="text-right">
                <p
                  className={`text-2xl font-bold ${metric.color} leading-none font-mono`}
                >
                  {metric.value}
                </p>
                <h3 className="text-xs text-slate-400 mt-1 font-mono">
                  {metric.label}
                </h3>
              </div>
            </div>
            <div className="w-full bg-slate-700/30 rounded-full h-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                className={`h-1 rounded-full bg-gradient-to-r ${
                  metric.color.includes("cyan")
                    ? "from-cyan-500 to-blue-500"
                    : metric.color.includes("blue")
                    ? "from-blue-500 to-purple-500"
                    : metric.color.includes("purple")
                    ? "from-purple-500 to-pink-500"
                    : "from-green-500 to-teal-500"
                }`}
              ></motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Embedding Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
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
              embedding-engine --real-time --documents
            </span>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4 font-mono">
              문서 임베딩 처리
            </h3>
            <div className="h-64 bg-slate-800/30 rounded-lg border border-slate-600/30 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-4 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute inset-4 border-4 border-blue-500 rounded-full border-b-transparent animate-spin animate-reverse"></div>
                <div className="absolute inset-8 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-cyan-400 font-mono text-xs">EMB</span>
                </div>
              </div>
              <div className="text-center text-slate-400 font-mono">
                <p className="text-cyan-400 text-lg font-bold">
                  {data.embeddingDimensions}
                </p>
                <p className="text-xs">Embedding Dimensions</p>
                <p className="text-xs mt-2">
                  Chunk Size: {data.chunkSize} tokens
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Retrieval Pipeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
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
              retrieval-pipeline --similarity --ranking
            </span>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4 font-mono">
              검색 파이프라인
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3 border border-slate-600/30">
                <span className="text-blue-400 font-mono">
                  Query Processing
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-300 font-mono text-sm">
                    Active
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3 border border-slate-600/30">
                <span className="text-purple-400 font-mono">
                  Similarity Search
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-300 font-mono text-sm">
                    Active
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3 border border-slate-600/30">
                <span className="text-green-400 font-mono">Result Ranking</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-300 font-mono text-sm">
                    Active
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3 border border-slate-600/30">
                <span className="text-yellow-400 font-mono">
                  Context Assembly
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-300 font-mono text-sm">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// LangGraph Workflows Component
function LangGraphWorkflows({ data }: { data: any[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-green-400 bg-green-500/10 border-green-500/30";
      case "paused":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "failed":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden">
        <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-slate-400 text-sm font-mono ml-2">
            langgraph-orchestrator --workflows --execution --monitoring
          </span>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-cyan-400 mb-6 font-mono">
            LangGraph 워크플로우 관리
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((workflow, index) => (
              <motion.div
                key={workflow.workflow}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30 hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-blue-400 font-mono font-bold text-lg">
                    {workflow.workflow}
                  </h4>
                  <span
                    className={`text-xs font-mono px-3 py-1 rounded-full border ${getStatusColor(
                      workflow.status
                    )}`}
                  >
                    {workflow.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-mono text-sm">
                      실행 횟수:
                    </span>
                    <span className="text-slate-300 font-mono text-sm">
                      {workflow.executions.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-mono text-sm">
                      성공률:
                    </span>
                    <span className="text-slate-300 font-mono text-sm">
                      {workflow.successRate}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${workflow.successRate}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                      className={`h-2 rounded-full ${
                        workflow.successRate > 95
                          ? "bg-green-500"
                          : workflow.successRate > 90
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></motion.div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500 font-mono text-xs">
                      평균 실행시간:
                    </span>
                    <div className="text-purple-400 font-mono text-sm">
                      {workflow.avgDuration}s
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Agent Orchestration Component
function AgentOrchestration({ data }: { data: any[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden">
        <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-slate-400 text-sm font-mono ml-2">
            agent-orchestrator --multi-agent --performance --resources
          </span>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-cyan-400 mb-6 font-mono">
            에이전트 오케스트레이션
          </h3>
          <div className="space-y-4">
            {data.map((agent, index) => (
              <motion.div
                key={agent.agent}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/30 rounded-lg p-5 border border-slate-600/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-blue-400 font-mono font-medium text-lg">
                    {agent.agent}
                  </h4>
                  <span className="text-slate-300 font-mono text-sm font-bold">
                    {agent.success}% success
                  </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-slate-400 font-mono mb-1">
                      CPU 사용률
                    </div>
                    <div className="text-lg font-bold text-cyan-400 font-mono">
                      {agent.cpu}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-400 font-mono mb-1">
                      메모리
                    </div>
                    <div className="text-lg font-bold text-blue-400 font-mono">
                      {agent.memory}GB
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-400 font-mono mb-1">
                      처리 작업
                    </div>
                    <div className="text-lg font-bold text-purple-400 font-mono">
                      {agent.tasks}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-400 font-mono mb-1">
                      성공률
                    </div>
                    <div className="text-lg font-bold text-green-400 font-mono">
                      {agent.success}%
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-700/50 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.success}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Vector Database Component
function VectorDatabase({
  data,
  selectedMetric,
  onMetricChange,
}: {
  data: any[];
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
}) {
  const metrics = [
    { key: "queries", label: "검색 쿼리", color: "text-cyan-400" },
    { key: "accuracy", label: "검색 정확도", color: "text-blue-400" },
    { key: "latency", label: "응답 지연시간", color: "text-green-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Selector */}
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden">
        <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-slate-400 text-sm font-mono ml-2">
            vector-db-monitor --real-time --metrics --performance
          </span>
        </div>
        <div className="p-4">
          <div className="flex space-x-2">
            {metrics.map((metric) => (
              <button
                key={metric.key}
                onClick={() => onMetricChange(metric.key)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-mono text-sm ${
                  selectedMetric === metric.key
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/50"
                    : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vector Database Performance Chart */}
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden">
        <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-slate-400 text-sm font-mono ml-2">
            vector-performance-chart --24h --similarity-search
          </span>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4 font-mono">
            24시간 벡터 데이터베이스 성능
          </h3>
          <div className="h-80 bg-slate-800/30 rounded-lg border border-slate-600/30 p-6">
            <div className="h-full flex items-end justify-between gap-2">
              {data.map((item, index) => {
                const height =
                  selectedMetric === "latency"
                    ? (item[selectedMetric] /
                        Math.max(...data.map((d) => d[selectedMetric]))) *
                      100
                    : (item[selectedMetric] /
                        Math.max(...data.map((d) => d[selectedMetric]))) *
                      100;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="text-xs text-slate-500 mb-2 font-mono">
                      {item.time}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-purple-500/40 to-cyan-500/60 rounded-t hover:from-purple-500/60 hover:to-cyan-500/80 transition-all duration-300 cursor-pointer relative group"
                      style={{ height: `${height}%`, minHeight: "20px" }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-xs text-cyan-400 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                        {selectedMetric === "latency"
                          ? `${item[selectedMetric]}ms`
                          : selectedMetric === "accuracy"
                          ? `${item[selectedMetric]}%`
                          : item[selectedMetric].toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs text-blue-400 mt-2 font-mono">
                      {selectedMetric === "latency"
                        ? `${item[selectedMetric]}ms`
                        : selectedMetric === "accuracy"
                        ? `${item[selectedMetric]}%`
                        : item[selectedMetric].toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
