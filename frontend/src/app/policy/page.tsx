"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

// Mock data for RAG + LangGraph policies
const mockPolicyData = {
  ragPolicies: [
    {
      id: 1,
      name: "Document Indexing Policy",
      category: "RAG",
      enabled: true,
      threshold: 0.85,
      description: "문서 자동 인덱싱 및 임베딩 생성 정책",
      lastModified: "2024-12-20",
      settings: {
        maxDocumentSize: "10MB",
        allowedFormats: ["pdf", "txt", "docx", "md"],
        autoIndex: true,
        chunkSize: 512,
      },
    },
    {
      id: 2,
      name: "Similarity Search Policy",
      category: "RAG",
      enabled: true,
      threshold: 0.75,
      description: "벡터 유사도 검색 및 컨텍스트 검색 정책",
      lastModified: "2024-12-19",
      settings: {
        topK: 5,
        similarityThreshold: 0.75,
        contextWindow: 2048,
        rerankingEnabled: true,
      },
    },
    {
      id: 3,
      name: "Content Filter Policy",
      category: "RAG",
      enabled: true,
      threshold: 0.9,
      description: "부적절한 콘텐츠 필터링 및 보안 정책",
      lastModified: "2024-12-18",
      settings: {
        filterLevel: "strict",
        blockedTypes: ["personal", "confidential"],
        scanEnabled: true,
        quarantineEnabled: true,
      },
    },
  ],
  workflowPolicies: [
    {
      id: 1,
      name: "Multi-Agent Execution Policy",
      workflow: "Document Analysis",
      enabled: true,
      maxExecutionTime: 300,
      retryCount: 3,
      priority: "high",
      description: "멀티 에이전트 문서 분석 워크플로우 실행 정책",
    },
    {
      id: 2,
      name: "Q&A Processing Policy",
      workflow: "Q&A Processing",
      enabled: true,
      maxExecutionTime: 120,
      retryCount: 2,
      priority: "medium",
      description: "질의응답 처리 워크플로우 실행 정책",
    },
    {
      id: 3,
      name: "Content Generation Policy",
      workflow: "Content Summarization",
      enabled: false,
      maxExecutionTime: 180,
      retryCount: 1,
      priority: "low",
      description: "콘텐츠 생성 및 요약 워크플로우 정책",
    },
  ],
  agentPermissions: [
    {
      agent: "Retriever Agent",
      permissions: {
        vectorRead: true,
        vectorWrite: false,
        documentAccess: true,
        apiAccess: true,
        maxRequests: 1000,
      },
      resourceLimits: {
        cpuLimit: "2 cores",
        memoryLimit: "4GB",
        timeoutLimit: "30s",
      },
    },
    {
      agent: "Generator Agent",
      permissions: {
        vectorRead: true,
        vectorWrite: false,
        documentAccess: true,
        apiAccess: true,
        maxRequests: 500,
      },
      resourceLimits: {
        cpuLimit: "4 cores",
        memoryLimit: "8GB",
        timeoutLimit: "60s",
      },
    },
    {
      agent: "Validator Agent",
      permissions: {
        vectorRead: true,
        vectorWrite: true,
        documentAccess: true,
        apiAccess: true,
        maxRequests: 200,
      },
      resourceLimits: {
        cpuLimit: "1 core",
        memoryLimit: "2GB",
        timeoutLimit: "15s",
      },
    },
  ],
  vectorSettings: {
    database: {
      engine: "Pinecone",
      dimensions: 1536,
      metric: "cosine",
      replicas: 2,
      shards: 4,
    },
    indexing: {
      batchSize: 100,
      autoRefresh: true,
      refreshInterval: "5m",
      parallelism: 4,
    },
    performance: {
      cacheEnabled: true,
      cacheSize: "1GB",
      queryTimeout: "30s",
      maxConnections: 100,
    },
  },
};

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState("rag");
  const [loading, setLoading] = useState(true);
  const [editingPolicy, setEditingPolicy] = useState<any>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

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
    { id: "rag", label: "RAG Policies" },
    { id: "workflows", label: "Workflow Policies" },
    { id: "agents", label: "Agent Permissions" },
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
                  policy-engine://rag-langgraph --initializing
                </span>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6">
              <div className="text-cyan-400 font-mono text-sm mb-4">
                $ policy-manager --rag --workflows --agents --vectors
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-4 h-4 border-2 border-cyan-500/50 border-t-cyan-500 rounded-full animate-spin"></div>
                <span className="text-slate-300 font-mono text-sm">
                  RAG + LangGraph 정책 시스템 로딩 중...
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-slate-400">
                  ✓ Loading RAG policies configuration
                </div>
                <div className="text-slate-400">
                  ✓ Initializing workflow policies
                </div>
                <div className="text-slate-400">
                  ✓ Configuring agent permissions
                </div>
                <div className="text-cyan-400 animate-pulse">
                  → Synchronizing vector database settings...
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
        {/* Terminal Header */}
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
              policy-manager://rag-langgraph-config --comprehensive
            </span>
          </div>

          {/* Command Interface */}
          <div className="p-4">
            <div className="flex items-center gap-4 text-sm font-mono mb-4">
              <span className="text-cyan-400">policy@rag-langgraph:~$</span>
              <span className="text-slate-300">
                configure --policies --workflows --permissions --vectors
              </span>
            </div>

            <div className="space-y-4">
              {/* Modern Title with Terminal ASCII Art */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-mono tracking-wider">
                    SYSTEM ONLINE
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-500 text-lg font-mono">
                      ╔══════════════╗
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-500 text-lg font-mono">║</span>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-mono tracking-wide">
                      Security Control Center
                    </h1>
                    <span className="text-cyan-500 text-lg font-mono">║</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-500 text-lg font-mono">
                      ╚══════════════╝
                    </span>
                  </div>
                </div>

                <div className="bg-slate-800/30 border-l-4 border-cyan-500 p-3 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-cyan-400 text-xs font-mono">
                      [OTEL + LangGraph Engine]
                    </span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-purple-400 text-xs font-mono">
                      Security Automation
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm font-mono leading-relaxed">
                    이벤트 트레이싱 기반 위협 탐지 및 자동 대응 시스템 제어
                  </p>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-6 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-400">OTEL Pipeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-blue-400">LangGraph AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-purple-400">Auto Response</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* EDR-Style Control Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Real-time Threat Dashboard */}
          <motion.div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden">
            <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-slate-400 text-sm font-mono ml-2">
                threat-monitor --real-time
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-cyan-400 font-mono text-sm mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                실시간 위협 상태
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm font-mono">
                    활성 정책
                  </span>
                  <span className="text-green-400 font-mono text-sm">8/8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm font-mono">
                    탐지된 위협
                  </span>
                  <span className="text-yellow-400 font-mono text-sm">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm font-mono">
                    차단된 액세스
                  </span>
                  <span className="text-red-400 font-mono text-sm">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm font-mono">
                    자동 대응
                  </span>
                  <span className="text-green-400 font-mono text-sm">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Alert Center */}
          <motion.div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden">
            <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-slate-400 text-sm font-mono ml-2">
                alert-center --notifications
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-orange-400 font-mono text-sm mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                최근 알림
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  <span className="text-red-400 font-mono">HIGH</span>
                  <span className="text-slate-300 font-mono">
                    정책 위반 탐지
                  </span>
                  <span className="text-slate-500 font-mono ml-auto">2m</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                  <span className="text-yellow-400 font-mono">MED</span>
                  <span className="text-slate-300 font-mono">임계값 초과</span>
                  <span className="text-slate-500 font-mono ml-auto">5m</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded text-xs">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span className="text-blue-400 font-mono">INFO</span>
                  <span className="text-slate-300 font-mono">
                    정책 업데이트
                  </span>
                  <span className="text-slate-500 font-mono ml-auto">8m</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden">
            <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-slate-400 text-sm font-mono ml-2">
                quick-actions --immediate
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-purple-400 font-mono text-sm mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                빠른 액션
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded text-xs text-blue-300 font-mono transition-colors">
                  전체 스캔
                </button>
                <button className="p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded text-xs text-green-300 font-mono transition-colors">
                  정책 동기화
                </button>
                <button className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded text-xs text-yellow-300 font-mono transition-colors">
                  에이전트 상태
                </button>
                <button className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded text-xs text-red-300 font-mono transition-colors">
                  비상 격리
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* System Performance & Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Search & Filter */}
          <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden">
            <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-slate-400 text-sm font-mono ml-2">
                search-engine --policy-filter
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="정책 이름, 규칙, 또는 키워드 검색..."
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-2 text-slate-300 placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                  />
                  <svg
                    className="w-4 h-4 text-slate-500 absolute right-3 top-2.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <button className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-300 font-mono text-sm transition-colors">
                  필터
                </button>
              </div>
            </div>
          </div>

          {/* System Performance */}
          <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden">
            <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-slate-400 text-sm font-mono ml-2">
                system-monitor --performance
              </span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-green-400 font-mono text-lg font-bold">
                    98%
                  </div>
                  <div className="text-slate-400 font-mono text-xs">
                    정책 적용률
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-mono text-lg font-bold">
                    2.1s
                  </div>
                  <div className="text-slate-400 font-mono text-xs">
                    평균 응답시간
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-mono text-lg font-bold">
                    24/7
                  </div>
                  <div className="text-slate-400 font-mono text-xs">
                    모니터링
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
              policy-navigator --tabs --configuration --management
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
                <RAGPolicies data={mockPolicyData.ragPolicies} />
              </motion.div>
            )}

            {activeTab === "workflows" && (
              <motion.div
                key="workflows"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <WorkflowPolicies data={mockPolicyData.workflowPolicies} />
              </motion.div>
            )}

            {activeTab === "agents" && (
              <motion.div
                key="agents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <AgentPermissions data={mockPolicyData.agentPermissions} />
              </motion.div>
            )}

            {activeTab === "vectors" && (
              <motion.div
                key="vectors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <VectorSettings data={mockPolicyData.vectorSettings} />
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

// RAG Policies Component
function RAGPolicies({ data }: { data: any[] }) {
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
            rag-policy-manager --indexing --search --filtering
          </span>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-cyan-400 font-mono">
              RAG 정책 관리
            </h3>
            <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-300 font-mono text-sm transition-colors">
              Add Policy
            </button>
          </div>

          <div className="space-y-4">
            {data.map((policy, index) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/30 rounded-lg p-5 border border-slate-600/30 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-blue-400 font-mono font-medium text-lg">
                      {policy.name}
                    </h4>
                    <p className="text-slate-400 font-mono text-sm mt-1">
                      {policy.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono px-3 py-1 rounded-full border ${
                        policy.enabled
                          ? "text-green-400 bg-green-500/10 border-green-500/30"
                          : "text-red-400 bg-red-500/10 border-red-500/30"
                      }`}
                    >
                      {policy.enabled ? "ENABLED" : "DISABLED"}
                    </span>
                    <button className="text-slate-400 hover:text-blue-400 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-slate-500 font-mono mb-1">
                      Category
                    </div>
                    <div className="text-sm text-purple-400 font-mono">
                      {policy.category}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-mono mb-1">
                      Threshold
                    </div>
                    <div className="text-sm text-cyan-400 font-mono">
                      {policy.threshold}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-mono mb-1">
                      Last Modified
                    </div>
                    <div className="text-sm text-yellow-400 font-mono">
                      {policy.lastModified}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-mono mb-1">
                      Status
                    </div>
                    <div
                      className={`text-sm font-mono ${
                        policy.enabled ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {policy.enabled ? "Active" : "Inactive"}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-xs text-slate-400 font-mono mb-2">
                    Policy Settings
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    {Object.entries(policy.settings).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-500">{key}:</span>
                        <span className="text-slate-300">
                          {Array.isArray(value)
                            ? value.join(", ")
                            : String(value)}
                        </span>
                      </div>
                    ))}
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

// Workflow Policies Component
function WorkflowPolicies({ data }: { data: any[] }) {
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
            workflow-policy-manager --execution --timeout --retry
          </span>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-cyan-400 font-mono">
              LangGraph 워크플로우 정책
            </h3>
            <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-300 font-mono text-sm transition-colors">
              Create Workflow Policy
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((policy, index) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/30 rounded-lg p-5 border border-slate-600/30 hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-blue-400 font-mono font-bold text-lg">
                    {policy.name}
                  </h4>
                  <span
                    className={`text-xs font-mono px-3 py-1 rounded-full border ${
                      policy.enabled
                        ? "text-green-400 bg-green-500/10 border-green-500/30"
                        : "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
                    }`}
                  >
                    {policy.enabled ? "ACTIVE" : "PAUSED"}
                  </span>
                </div>

                <p className="text-slate-400 font-mono text-sm mb-4">
                  {policy.description}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-mono text-sm">
                      Workflow:
                    </span>
                    <span className="text-cyan-400 font-mono text-sm">
                      {policy.workflow}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-mono text-sm">
                      Max Execution:
                    </span>
                    <span className="text-blue-400 font-mono text-sm">
                      {policy.maxExecutionTime}s
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-mono text-sm">
                      Retry Count:
                    </span>
                    <span className="text-purple-400 font-mono text-sm">
                      {policy.retryCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-mono text-sm">
                      Priority:
                    </span>
                    <span
                      className={`font-mono text-sm ${
                        policy.priority === "high"
                          ? "text-red-400"
                          : policy.priority === "medium"
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {policy.priority.toUpperCase()}
                    </span>
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

// Agent Permissions Component
function AgentPermissions({ data }: { data: any[] }) {
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
            agent-permission-manager --access --resources --limits
          </span>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-cyan-400 font-mono">
              에이전트 권한 관리
            </h3>
            <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-300 font-mono text-sm transition-colors">
              Configure Agent
            </button>
          </div>

          <div className="space-y-4">
            {data.map((agent, index) => (
              <motion.div
                key={agent.agent}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/30 rounded-lg p-5 border border-slate-600/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-blue-400 font-mono font-medium text-lg">
                    {agent.agent}
                  </h4>
                  <button className="text-slate-400 hover:text-blue-400 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-slate-400 font-mono mb-3">
                      Permissions
                    </div>
                    <div className="space-y-2">
                      {Object.entries(agent.permissions).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between bg-slate-800/50 rounded px-3 py-2"
                        >
                          <span className="text-slate-300 font-mono text-sm">
                            {key}
                          </span>
                          <span
                            className={`text-sm font-mono ${
                              typeof value === "boolean"
                                ? value
                                  ? "text-green-400"
                                  : "text-red-400"
                                : "text-cyan-400"
                            }`}
                          >
                            {typeof value === "boolean"
                              ? value
                                ? "ALLOWED"
                                : "DENIED"
                              : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-400 font-mono mb-3">
                      Resource Limits
                    </div>
                    <div className="space-y-2">
                      {Object.entries(agent.resourceLimits).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between bg-slate-800/50 rounded px-3 py-2"
                          >
                            <span className="text-slate-300 font-mono text-sm">
                              {key}
                            </span>
                            <span className="text-purple-400 font-mono text-sm">
                              {value}
                            </span>
                          </div>
                        )
                      )}
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

// Vector Settings Component
function VectorSettings({ data }: { data: any }) {
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
            vector-db-config --database --indexing --performance
          </span>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-cyan-400 mb-6 font-mono">
            벡터 데이터베이스 설정
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Database Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/30 rounded-lg p-5 border border-slate-600/30"
            >
              <h4 className="text-blue-400 font-mono font-medium text-lg mb-4">
                Database Configuration
              </h4>
              <div className="space-y-3">
                {Object.entries(data.database).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-slate-400 font-mono text-sm">
                      {key}:
                    </span>
                    <span className="text-cyan-400 font-mono text-sm">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Indexing Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/30 rounded-lg p-5 border border-slate-600/30"
            >
              <h4 className="text-purple-400 font-mono font-medium text-lg mb-4">
                Indexing Settings
              </h4>
              <div className="space-y-3">
                {Object.entries(data.indexing).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-slate-400 font-mono text-sm">
                      {key}:
                    </span>
                    <span className="text-purple-400 font-mono text-sm">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Performance Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/30 rounded-lg p-5 border border-slate-600/30"
            >
              <h4 className="text-green-400 font-mono font-medium text-lg mb-4">
                Performance Settings
              </h4>
              <div className="space-y-3">
                {Object.entries(data.performance).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-slate-400 font-mono text-sm">
                      {key}:
                    </span>
                    <span className="text-green-400 font-mono text-sm">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-300 font-mono text-sm transition-colors">
              Apply Configuration
            </button>
            <button className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-300 font-mono text-sm transition-colors">
              Test Connection
            </button>
            <button className="px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-lg text-yellow-300 font-mono text-sm transition-colors">
              Backup Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
