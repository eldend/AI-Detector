"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

// Trace 데이터 타입을 정의합니다.
interface Trace {
  trace_id: string;
  timestamp: string;
  host: { hostname: string; ip: string; os: string };
  label: string;
  events: any[];
  sigma_match: string[];
  prompt_input: string;
}

// 공격 단계 설명 데이터
const attackStageExplanations = [
  {
    stage: "초기 침입",
    description: "악성 프로그램이 컴퓨터에 처음 들어오는 단계",
    color: "text-red-400",
    icon: "•",
  },
  {
    stage: "권한 확대",
    description: "악성 프로그램이 더 많은 권한을 얻으려고 시도",
    color: "text-orange-400",
    icon: "•",
  },
  {
    stage: "정보 수집",
    description: "시스템 정보나 사용자 데이터를 수집",
    color: "text-yellow-400",
    icon: "•",
  },
  {
    stage: "네트워크 연결",
    description: "외부 서버와 통신하여 명령을 받거나 데이터 전송",
    color: "text-blue-400",
    icon: "•",
  },
  {
    stage: "데이터 탈취",
    description: "중요한 파일이나 정보를 외부로 전송",
    color: "text-purple-400",
    icon: "•",
  },
];

// 이벤트 타입별 설명
const eventTypeExplanations: { [key: string]: string } = {
  process_creation: "프로그램 실행 - 새로운 프로그램이 시작되었습니다",
  network_connection: "네트워크 연결 - 인터넷이나 다른 컴퓨터와 통신합니다",
  file_access: "파일 접근 - 파일을 읽거나 수정하려고 합니다",
  registry_modification: "시스템 설정 변경 - 윈도우 시스템 설정을 수정합니다",
  privilege_escalation: "권한 상승 - 더 높은 권한을 얻으려고 시도합니다",
  data_exfiltration: "데이터 유출 - 중요한 정보를 외부로 전송합니다",
};

function EventsPageContent() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [selected, setSelected] = useState(0);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [filter, setFilter] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>("24h");
  const [isLoading, setIsLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<"report" | "response">("report");

  useEffect(() => {
    const fetchTraces = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/traces");
        const data = await response.json();
        setTraces(data);
      } catch (error) {
        console.error("Failed to fetch traces:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTraces();
  }, []);

  useEffect(() => {
    if (traces.length === 0) return;

    const selectedTrace = traces[selected];
    if (!selectedTrace) return;

    const newNodes = selectedTrace.events.map((event, idx) => {
      let label = event.process_name || event.event_type;
      if (event.process_name && event.event_type !== "process_creation") {
        const eventTypeShort = event.event_type.split("_")[0];
        label = `${event.process_name} (${eventTypeShort})`;
      }

      // 초보자 친화적인 설명 추가
      const explanation =
        eventTypeExplanations[event.event_type] || event.event_type;

      return {
        id: String(idx),
        data: {
          label: label,
          event: event,
          explanation: explanation,
        },
        position: { x: 0, y: idx * 150 },
        type: "default",
        style: {
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(59, 130, 246, 0.5)",
          borderRadius: "8px",
          color: "#e2e8f0",
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          fontSize: "14px",
          backdropFilter: "blur(8px)",
          padding: "12px",
          minWidth: "250px",
          minHeight: "80px",
        },
      };
    });

    const newEdges = selectedTrace.events.slice(1).map((_, idx) => ({
      id: `e${idx}-${idx + 1}`,
      source: String(idx),
      target: String(idx + 1),
      type: "straight",
      style: {
        stroke: "#3b82f6",
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#3b82f6",
      },
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [selected, traces, setNodes, setEdges]);

  const filteredTraces = traces.filter(
    (trace) =>
      trace.host.hostname.toLowerCase().includes(filter.toLowerCase()) ||
      trace.label.toLowerCase().includes(filter.toLowerCase()) ||
      trace.trace_id.toLowerCase().includes(filter.toLowerCase())
  );

  const anomalyCount = filteredTraces.filter((t) => t.label === "이상").length;
  const threatLevel =
    anomalyCount > 5 ? "HIGH" : anomalyCount > 2 ? "MEDIUM" : "LOW";
  const threatColor =
    threatLevel === "HIGH"
      ? "text-red-400"
      : threatLevel === "MEDIUM"
      ? "text-yellow-400"
      : "text-green-400";

  // 위험도 한국어 변환
  const threatLevelKorean =
    threatLevel === "HIGH"
      ? "위험"
      : threatLevel === "MEDIUM"
      ? "주의"
      : "안전";

  // 선택된 노드의 상세 정보
  const nodeDetail =
    selectedNode && traces[selected]
      ? {
          event: traces[selected].events[Number((selectedNode as any).id)],
          index: (selectedNode as any).id,
          host: traces[selected].host.hostname,
          os: traces[selected].host.os,
          sigma: traces[selected].sigma_match,
          explanation: (selectedNode as any).data.explanation,
        }
      : null;

  // 선택된 트레이스의 LLM 분석 결과 생성
  const generateLLMAnalysis = (trace: Trace) => {
    const analysisData = {
      riskLevel: trace.label === "이상" ? "높음" : "낮음",
      affectedSystems: [trace.host.hostname],
      attackVector:
        trace.events.length > 0 ? trace.events[0].event_type : "알 수 없음",
      totalSteps: trace.events.length,
      criticalEvents: trace.events.filter(
        (event) =>
          event.event_type === "privilege_escalation" ||
          event.event_type === "network_connection" ||
          event.event_type === "data_exfiltration"
      ).length,
      recommendation:
        trace.label === "이상"
          ? "즉시 보안팀에 신고하고 해당 시스템을 점검하세요"
          : "현재 안전한 상태이지만 지속적인 모니터링을 권장합니다",
      summary: trace.prompt_input || "분석 중...",
    };

    return analysisData;
  };

  const currentAnalysis =
    traces.length > 0 && traces[selected]
      ? generateLLMAnalysis(traces[selected])
      : null;

  if (isLoading) {
    return (
      <DashboardLayout onLogout={() => {}} onOpenSettings={() => {}}>
        {/* 3D Bubbles Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-xl animate-float-delay-1"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-green-500/15 to-blue-500/15 rounded-full blur-xl animate-float-delay-2"></div>
          <div className="absolute bottom-40 right-10 w-60 h-60 bg-gradient-to-br from-pink-500/20 to-yellow-500/20 rounded-full blur-xl animate-float-delay-3"></div>
        </div>

        <div className="flex items-center justify-center h-full relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-slate-300 font-mono">
              보안 알림 데이터를 불러오는 중...
            </p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  if (traces.length === 0) {
    return (
      <DashboardLayout onLogout={() => {}} onOpenSettings={() => {}}>
        {/* 3D Bubbles Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-xl animate-float-delay-1"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-green-500/15 to-blue-500/15 rounded-full blur-xl animate-float-delay-2"></div>
          <div className="absolute bottom-40 right-10 w-60 h-60 bg-gradient-to-br from-pink-500/20 to-yellow-500/20 rounded-full blur-xl animate-float-delay-3"></div>
        </div>

        <div className="flex items-center justify-center h-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-xl text-slate-300 font-mono">
              현재 보안 알림이 없습니다
            </p>
            <p className="text-sm text-slate-500 font-mono mt-2">
              시스템이 안전하게 운영되고 있습니다
            </p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout onLogout={() => {}} onOpenSettings={() => {}}>
      {/* 3D Bubbles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-xl animate-float-delay-1"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-green-500/15 to-blue-500/15 rounded-full blur-xl animate-float-delay-2"></div>
        <div className="absolute bottom-40 right-10 w-60 h-60 bg-gradient-to-br from-pink-500/20 to-yellow-500/20 rounded-full blur-xl animate-float-delay-3"></div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        {/* 초보자 가이드 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md border border-blue-500/30 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                보안 알림 센터
              </h1>
              <p className="text-slate-300 text-sm">
                의심스러운 활동을 발견했을 때 단계별로 어떤 일이 일어났는지
                보여드립니다
              </p>
            </div>
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-colors"
            >
              {showGuide ? "가이드 접기" : "초보자 가이드"}
            </button>
          </div>
        </motion.div>

        {/* 초보자 가이드 테이블 */}
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-lg font-bold text-cyan-400 mb-4">
                  보안 알림 이해하기
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-semibold text-white mb-3">
                      공격 단계별 설명
                    </h3>
                    <div className="space-y-3">
                      {attackStageExplanations.map((stage, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg"
                        >
                          <span className="text-lg">{stage.icon}</span>
                          <div>
                            <div className={`font-semibold ${stage.color}`}>
                              {stage.stage}
                            </div>
                            <div className="text-sm text-slate-400">
                              {stage.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-white mb-3">
                      이 화면 사용법
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="font-semibold text-green-400 mb-1">
                          1. 알림 목록 확인
                        </div>
                        <div className="text-slate-400">
                          오른쪽 목록에서 의심스러운 활동을 선택하세요
                        </div>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="font-semibold text-blue-400 mb-1">
                          2. 공격 흐름 보기
                        </div>
                        <div className="text-slate-400">
                          가운데 화면에서 공격이 어떻게 진행되었는지 확인하세요
                        </div>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="font-semibold text-purple-400 mb-1">
                          3. 세부 정보 확인
                        </div>
                        <div className="text-slate-400">
                          각 단계를 클릭하면 자세한 정보를 볼 수 있습니다
                        </div>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="font-semibold text-yellow-400 mb-1">
                          4. 위험도 판단
                        </div>
                        <div className="text-slate-400">
                          위험/주의/안전 표시를 확인하여 심각성을 판단하세요
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
              보안 알림 모니터링 시스템
            </span>
          </div>

          {/* Command Interface */}
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4 text-sm font-mono">
              <span className="text-blue-400">보안센터@알림분석:~$</span>
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="컴퓨터 이름이나 알림 내용으로 검색..."
                  className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded px-3 py-2 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-slate-800/50 border border-slate-600/50 rounded px-3 py-2 text-slate-300 focus:outline-none focus:border-blue-500/50"
                >
                  <option value="1h">최근 1시간</option>
                  <option value="24h">최근 24시간</option>
                  <option value="7d">최근 7일</option>
                  <option value="30d">최근 30일</option>
                </select>
              </div>
            </div>

            {/* Status Info */}
            <div className="flex items-center gap-6 text-xs font-mono">
              <span className="text-slate-400">
                총 알림 수:{" "}
                <span className="text-cyan-400">{filteredTraces.length}</span>
              </span>
              <span className="text-slate-400">
                의심스러운 활동:{" "}
                <span className="text-red-400">{anomalyCount}</span>
              </span>
              <span className="text-slate-400">
                위험도: <span className={threatColor}>{threatLevelKorean}</span>
              </span>
              <span className="text-slate-400">
                모니터링 상태: <span className="text-green-400">정상 작동</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-row gap-6 h-[1600px] min-h-0"
        >
          {/* Left Column: Flow Chart + AI Analysis */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Attack Flow Visualization */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="h-[950px] flex flex-col bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden"
            >
              {/* Terminal Window Header */}
              <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-slate-400 text-sm font-mono ml-2">
                  공격 흐름 시각화 - 클릭하면 자세한 정보를 볼 수 있습니다
                </span>
              </div>

              {/* Flow Chart */}
              <div className="flex-1 w-full bg-slate-900/50 relative">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  className="bg-transparent"
                  onNodeClick={(_: any, node: any) => setSelectedNode(node)}
                  fitView
                  fitViewOptions={{
                    padding: 20,
                    includeHiddenNodes: false,
                    minZoom: 1.5,
                    maxZoom: 4.0,
                  }}
                  defaultViewport={{ x: 0, y: 0, zoom: 2.5 }}
                  minZoom={0.5}
                  maxZoom={4}
                  attributionPosition="bottom-left"
                  panOnDrag
                  panOnScroll
                  zoomOnScroll
                  zoomOnPinch
                  zoomOnDoubleClick
                  style={{ backgroundColor: "transparent" }}
                />
                {nodes.length > 0 && (
                  <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 text-xs">
                    <div className="text-slate-400 mb-1">• 도움말</div>
                    <div className="text-slate-300">각 박스를 클릭하면</div>
                    <div className="text-slate-300">
                      상세 정보를 확인할 수 있습니다
                    </div>
                  </div>
                )}
              </div>
            </motion.section>

            {/* LLM 분석 테이블 */}
            {currentAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="h-[600px] bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden"
              >
                <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-slate-400 text-sm font-mono ml-2">
                    AI 분석 결과 -{" "}
                    {traces[selected]?.host.hostname || "선택된 시스템"}
                  </span>
                </div>

                <div className="p-4 overflow-y-auto h-[540px]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-cyan-400">
                      AI 위협 분석 보고서
                    </h2>

                    {/* 탭 네비게이션 */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setActiveTab("report")}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          activeTab === "report"
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
                        }`}
                      >
                        종합보고
                      </button>
                      <button
                        onClick={() => setActiveTab("response")}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          activeTab === "response"
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
                        }`}
                      >
                        대응제안
                      </button>
                    </div>
                  </div>

                  {/* 종합보고 탭 */}
                  {activeTab === "report" && (
                    <div className="space-y-6">
                      {/* 초보자 친화적 설명 섹션 */}
                      <div className="mb-6">
                        <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                          쉬운 설명
                        </h3>
                        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                          <div className="text-slate-200 text-sm leading-relaxed space-y-2">
                            <p>
                              {currentAnalysis.riskLevel === "높음"
                                ? "• 현재 컴퓨터에서 위험한 활동이 발견되었습니다. 누군가 허가없이 컴퓨터에 접근하려고 시도한 흔적이 보입니다."
                                : "• 현재 컴퓨터 상태는 안전한 것으로 보입니다. 일부 의심스러운 활동이 있었지만 위험하지 않습니다."}
                            </p>
                            <p>
                              • 총{" "}
                              <span className="text-cyan-400 font-semibold">
                                {currentAnalysis.totalSteps}단계
                              </span>
                              의 활동이 있었고, 그 중{" "}
                              <span className="text-purple-400 font-semibold">
                                {currentAnalysis.criticalEvents}개
                              </span>
                              가 중요한 이벤트입니다.
                            </p>
                            <p>
                              • 공격 방법:{" "}
                              <span className="text-yellow-400 font-semibold">
                                {currentAnalysis.attackVector === "Network" &&
                                  "네트워크를 통한 접근 시도"}
                                {currentAnalysis.attackVector === "Process" &&
                                  "프로그램 실행을 통한 접근 시도"}
                                {currentAnalysis.attackVector === "Registry" &&
                                  "시스템 설정 변경을 통한 접근 시도"}
                                {currentAnalysis.attackVector === "File" &&
                                  "파일 조작을 통한 접근 시도"}
                                {![
                                  "Network",
                                  "Process",
                                  "Registry",
                                  "File",
                                ].includes(currentAnalysis.attackVector) &&
                                  "기타 방법"}
                              </span>
                            </p>
                            <p>
                              • 영향받은 시스템:{" "}
                              <span className="text-cyan-400 font-semibold">
                                {currentAnalysis.affectedSystems.join(", ")}
                              </span>
                            </p>
                            <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                              <div className="text-xs text-slate-400 mb-1">
                                • 간단 요약
                              </div>
                              <div className="text-sm text-slate-200">
                                {currentAnalysis.riskLevel === "높음"
                                  ? "지금 즉시 조치가 필요합니다. 아래 권장 조치를 확인하고 따라해 주세요."
                                  : "현재는 안전하지만 계속 모니터링하고 있습니다. 정기적으로 확인해 주세요."}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 공격 흐름 설명 섹션 */}
                      <div className="mb-6">
                        <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          공격 흐름 분석
                        </h3>
                        <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                          <div className="text-slate-200 text-sm leading-relaxed space-y-3">
                            <p className="text-yellow-400 font-semibold">
                              • 다음은 이번 보안 사건이 어떤 순서로 진행되었는지
                              보여줍니다:
                            </p>

                            <div className="space-y-4">
                              {/* 1단계 */}
                              <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center">
                                  <span className="text-red-400 font-bold text-sm">
                                    1
                                  </span>
                                </div>
                                <div>
                                  <div className="text-red-400 font-semibold">
                                    초기 침입 단계
                                  </div>
                                  <div className="text-slate-300 text-sm">
                                    {currentAnalysis.attackVector ===
                                      "Network" &&
                                      "외부에서 네트워크를 통해 컴퓨터에 접근을 시도했습니다."}
                                    {currentAnalysis.attackVector ===
                                      "Process" &&
                                      "의심스러운 프로그램이 실행되기 시작했습니다."}
                                    {currentAnalysis.attackVector ===
                                      "Registry" &&
                                      "시스템 설정을 몰래 변경하려고 시도했습니다."}
                                    {currentAnalysis.attackVector === "File" &&
                                      "중요한 파일을 조작하려고 시도했습니다."}
                                    {![
                                      "Network",
                                      "Process",
                                      "Registry",
                                      "File",
                                    ].includes(currentAnalysis.attackVector) &&
                                      "알 수 없는 방법으로 침입을 시도했습니다."}
                                  </div>
                                </div>
                              </div>

                              {/* 2단계 */}
                              <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center">
                                  <span className="text-orange-400 font-bold text-sm">
                                    2
                                  </span>
                                </div>
                                <div>
                                  <div className="text-orange-400 font-semibold">
                                    권한 확대 단계
                                  </div>
                                  <div className="text-slate-300 text-sm">
                                    침입에 성공한 후, 더 많은 권한을 얻기 위해
                                    시스템을 조작했습니다. 관리자 권한을
                                    얻으려고 시도했을 가능성이 높습니다.
                                  </div>
                                </div>
                              </div>

                              {/* 3단계 */}
                              <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 border border-yellow-500/30 rounded-full flex items-center justify-center">
                                  <span className="text-yellow-400 font-bold text-sm">
                                    3
                                  </span>
                                </div>
                                <div>
                                  <div className="text-yellow-400 font-semibold">
                                    정보 수집 단계
                                  </div>
                                  <div className="text-slate-300 text-sm">
                                    컴퓨터 안에서 중요한 정보를 찾기 위해 여러
                                    파일과 폴더를 확인했습니다. 개인정보나
                                    중요한 문서를 찾으려고 했을 수 있습니다.
                                  </div>
                                </div>
                              </div>

                              {/* 4단계 */}
                              <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center">
                                  <span className="text-purple-400 font-bold text-sm">
                                    4
                                  </span>
                                </div>
                                <div>
                                  <div className="text-purple-400 font-semibold">
                                    지속성 확보 단계
                                  </div>
                                  <div className="text-slate-300 text-sm">
                                    나중에 다시 접근할 수 있도록 시스템에 흔적을
                                    남겼습니다. 자동 실행 프로그램을 만들거나
                                    백도어를 설치했을 가능성이 있습니다.
                                  </div>
                                </div>
                              </div>

                              {/* 5단계 */}
                              <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
                                  <span className="text-blue-400 font-bold text-sm">
                                    5
                                  </span>
                                </div>
                                <div>
                                  <div className="text-blue-400 font-semibold">
                                    데이터 반출 단계
                                  </div>
                                  <div className="text-slate-300 text-sm">
                                    {currentAnalysis.riskLevel === "높음"
                                      ? "수집한 정보를 외부로 보내려고 시도했습니다. 이 단계에서 실제 피해가 발생할 수 있습니다."
                                      : "다행히 중요한 정보가 외부로 유출되지는 않은 것으로 보입니다."}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                              <div className="text-xs text-slate-400 mb-1">
                                • 탐지 시점
                              </div>
                              <div className="text-sm text-slate-200">
                                우리 보안 시스템은{" "}
                                <span className="text-cyan-400 font-semibold">
                                  {currentAnalysis.criticalEvents}단계
                                </span>
                                에서 이 활동을 발견하고 모니터링하고 있습니다.
                                총{" "}
                                <span className="text-cyan-400 font-semibold">
                                  {currentAnalysis.totalSteps}단계
                                </span>
                                중에서 위험한 활동을 조기에 발견한 것입니다.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-md font-semibold text-white mb-3">
                            위험도 평가
                          </h3>
                          <div className="space-y-3">
                            <div className="p-3 bg-slate-800/50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">
                                  위험 등급
                                </span>
                                <span
                                  className={`font-semibold ${
                                    currentAnalysis.riskLevel === "높음"
                                      ? "text-red-400"
                                      : "text-green-400"
                                  }`}
                                >
                                  {currentAnalysis.riskLevel}
                                </span>
                              </div>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">
                                  영향받은 시스템
                                </span>
                                <span className="text-cyan-400">
                                  {currentAnalysis.affectedSystems.join(", ")}
                                </span>
                              </div>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">
                                  공격 벡터
                                </span>
                                <span className="text-yellow-400">
                                  {eventTypeExplanations[
                                    currentAnalysis.attackVector
                                  ] || currentAnalysis.attackVector}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-md font-semibold text-white mb-3">
                            분석 통계
                          </h3>
                          <div className="space-y-3">
                            <div className="p-3 bg-slate-800/50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">
                                  총 단계 수
                                </span>
                                <span className="text-blue-400">
                                  {currentAnalysis.totalSteps}
                                </span>
                              </div>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">
                                  중요 이벤트
                                </span>
                                <span className="text-purple-400">
                                  {currentAnalysis.criticalEvents}
                                </span>
                              </div>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">
                                  탐지 규칙
                                </span>
                                <span className="text-green-400">
                                  {traces[selected]?.sigma_match.length || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-md font-semibold text-white mb-2">
                          AI 분석 요약
                        </h3>
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="text-slate-300 text-sm leading-relaxed">
                            {currentAnalysis.summary}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 대응제안 탭 */}
                  {activeTab === "response" && (
                    <div className="space-y-6">
                      {/* 즉시 대응 조치 */}
                      <div className="mb-6">
                        <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          즉시 대응 조치
                        </h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg border border-red-500/20">
                            <div className="text-red-400 font-semibold mb-2">
                              • 긴급 조치 (지금 즉시)
                            </div>
                            <div className="text-slate-300 text-sm leading-relaxed space-y-2">
                              <div>
                                • 1단계: 현재 작업을 저장하고 중단하세요
                              </div>
                              <div>
                                • 2단계: 실행 중인 의심스러운 프로그램을
                                종료하세요
                              </div>
                              <div>• 3단계: 관리자에게 즉시 신고하세요</div>
                            </div>
                          </div>

                          <div className="p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg border border-orange-500/20">
                            <div className="text-orange-400 font-semibold mb-2">
                              • 단기 대응 (30분 내)
                            </div>
                            <div className="text-slate-300 text-sm leading-relaxed space-y-2">
                              <div>• 백신 프로그램으로 전체 검사 실행</div>
                              <div>• 시스템 복원 지점 확인</div>
                              <div>• 중요한 파일 백업 상태 점검</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 상세 대응 가이드 */}
                      <div className="mb-6">
                        <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          단계별 상세 가이드
                        </h3>
                        <div className="space-y-4">
                          {/* 1단계 */}
                          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
                                <span className="text-blue-400 font-bold text-sm">
                                  1
                                </span>
                              </div>
                              <div>
                                <div className="text-blue-400 font-semibold mb-2">
                                  현재 상태 확인
                                </div>
                                <div className="text-slate-300 text-sm leading-relaxed">
                                  현재 실행 중인 프로그램들을 확인하고 작업을
                                  임시 중단하세요. 중요한 문서는 미리 저장해
                                  두세요.
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 2단계 */}
                          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
                                <span className="text-green-400 font-bold text-sm">
                                  2
                                </span>
                              </div>
                              <div>
                                <div className="text-green-400 font-semibold mb-2">
                                  시스템 검사
                                </div>
                                <div className="text-slate-300 text-sm leading-relaxed">
                                  작업 관리자(Ctrl+Shift+Esc)를 열어서 이상한
                                  프로그램이 실행되고 있는지 확인하세요. CPU
                                  사용률이 높은 알 수 없는 프로그램을
                                  찾아보세요.
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 3단계 */}
                          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center">
                                <span className="text-purple-400 font-bold text-sm">
                                  3
                                </span>
                              </div>
                              <div>
                                <div className="text-purple-400 font-semibold mb-2">
                                  보안 검사
                                </div>
                                <div className="text-slate-300 text-sm leading-relaxed">
                                  Windows Defender나 설치된 백신 프로그램으로
                                  전체 시스템 검사를 실행하세요. 이 과정은
                                  1-2시간 걸릴 수 있습니다.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 예방 조치 */}
                      <div className="mb-6">
                        <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          향후 예방 조치
                        </h3>
                        <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                          <div className="text-slate-200 text-sm leading-relaxed space-y-2">
                            <div>• 정기적인 보안 업데이트 설치</div>
                            <div>• 의심스러운 이메일 첨부파일 열지 않기</div>
                            <div>• 중요한 데이터 정기적 백업</div>
                            <div>• 강력한 비밀번호 사용 및 정기적 변경</div>
                            <div>• 출처 불분명한 소프트웨어 설치 금지</div>
                          </div>
                        </div>
                      </div>

                      {/* 연락처 정보 */}
                      <div className="mb-6">
                        <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          도움이 필요하면
                        </h3>
                        <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                          <div className="text-slate-200 text-sm leading-relaxed space-y-2">
                            <div>• IT 관리자: 내선 1234</div>
                            <div>• 보안팀: security@company.com</div>
                            <div>• 긴급상황: 02-1234-5678</div>
                            <div>
                              • 혼자 해결하기 어려우면 즉시 전문가에게
                              연락하세요
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Trace List */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-80 bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden flex flex-col"
          >
            {/* Terminal Window Header */}
            <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-slate-400 text-sm font-mono ml-2">
                보안 알림 목록
              </span>
            </div>

            <div className="p-6 flex flex-col flex-1 min-h-0">
              <h2 className="text-lg font-bold text-cyan-400 font-mono mb-4">
                의심스러운 활동 목록
              </h2>

              <ul className="space-y-3 flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                {filteredTraces.map((trace, idx) => (
                  <motion.li
                    key={trace.trace_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <button
                      onClick={() => {
                        // 원본 배열에서의 실제 인덱스를 찾습니다
                        const originalIndex = traces.findIndex(
                          (t) => t.trace_id === trace.trace_id
                        );
                        setSelected(originalIndex);
                        setSelectedNode(null);
                      }}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 font-mono text-sm ${
                        selected ===
                        traces.findIndex((t) => t.trace_id === trace.trace_id)
                          ? "bg-blue-500/20 border-blue-500/50 text-blue-100"
                          : "bg-slate-800/30 border-slate-600/30 text-slate-300 hover:bg-slate-700/30 hover:border-slate-500/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-cyan-400">
                          {trace.host.hostname}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${
                            trace.label === "이상"
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-green-500/20 text-green-400 border-green-500/30"
                          }`}
                        >
                          {trace.label === "이상" ? "위험" : "안전"}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 truncate mb-1">
                        {trace.prompt_input}
                      </div>
                      <div className="text-xs text-slate-500 truncate mb-1">
                        ID: {trace.trace_id}
                      </div>
                      <div className="text-xs text-slate-400">
                        {trace.events.length}개 단계 •{" "}
                        {trace.sigma_match.length}개 탐지 규칙
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(trace.timestamp).toLocaleString("ko-KR")}
                      </div>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </motion.div>

        {/* Node Detail Modal */}
        <AnimatePresence>
          {selectedNode && nodeDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedNode(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl p-8 min-w-[500px] max-w-2xl relative font-mono"
              >
                {/* Terminal Header */}
                <div className="bg-slate-800/80 px-4 py-2 -mx-8 -mt-8 mb-6 border-b border-slate-700/50 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-slate-400 text-sm font-mono ml-2">
                    보안 이벤트 상세 정보
                  </span>
                  <button
                    className="ml-auto text-slate-400 hover:text-red-400 text-lg font-bold"
                    onClick={() => setSelectedNode(null)}
                  >
                    ×
                  </button>
                </div>

                <h3 className="text-lg font-bold mb-4 text-cyan-400">
                  단계별 상세 정보
                </h3>

                {/* 초보자 친화적인 설명 */}
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-blue-300 font-semibold mb-2">
                    이 단계에서 일어난 일
                  </div>
                  <div className="text-slate-300">{nodeDetail.explanation}</div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400">활동 유형:</span>
                      <div className="text-purple-300 font-bold">
                        {nodeDetail.event.event_type}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">단계 번호:</span>
                      <div className="text-blue-300">
                        {Number(nodeDetail.index) + 1}
                      </div>
                    </div>
                  </div>

                  {nodeDetail.event.process_name && (
                    <div>
                      <span className="text-slate-400">실행된 프로그램:</span>
                      <div className="text-green-300 bg-green-500/10 p-2 rounded border border-green-500/20 mt-1">
                        {nodeDetail.event.process_name}
                      </div>
                    </div>
                  )}

                  {nodeDetail.event.command_line && (
                    <div>
                      <span className="text-slate-400">실행 명령어:</span>
                      <div className="text-yellow-300 bg-yellow-500/10 p-2 rounded border border-yellow-500/20 mt-1 break-all text-xs">
                        {nodeDetail.event.command_line}
                      </div>
                    </div>
                  )}

                  {(nodeDetail.event as any).parent_process && (
                    <div>
                      <span className="text-slate-400">상위 프로세스:</span>
                      <div className="text-orange-300">
                        {(nodeDetail.event as any).parent_process}
                      </div>
                    </div>
                  )}

                  {(nodeDetail.event as any).destination_ip && (
                    <div>
                      <span className="text-slate-400">네트워크 연결:</span>
                      <div className="text-red-300">
                        {(nodeDetail.event as any).destination_ip}:
                        {(nodeDetail.event as any).destination_port}
                      </div>
                    </div>
                  )}

                  {(nodeDetail.event as any).registry_path && (
                    <div>
                      <span className="text-slate-400">레지스트리 경로:</span>
                      <div className="text-pink-300 break-all text-xs">
                        {(nodeDetail.event as any).registry_path}
                      </div>
                    </div>
                  )}

                  {(nodeDetail.event as any).file_path && (
                    <div>
                      <span className="text-slate-400">파일 경로:</span>
                      <div className="text-violet-300 break-all text-xs">
                        {(nodeDetail.event as any).file_path}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                    <div>
                      <span className="text-slate-400">컴퓨터:</span>
                      <div className="text-cyan-300">{nodeDetail.host}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">운영체제:</span>
                      <div className="text-cyan-300">{nodeDetail.os}</div>
                    </div>
                  </div>

                  {nodeDetail.sigma.length > 0 && (
                    <div>
                      <span className="text-slate-400">탐지된 위험 패턴:</span>
                      <div className="space-y-1 mt-2">
                        {nodeDetail.sigma.map((rule, index) => (
                          <div
                            key={index}
                            className="text-yellow-300 bg-yellow-500/10 p-2 rounded border border-yellow-500/20 text-xs"
                          >
                            {rule}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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

export default function EventsPage() {
  return (
    <ReactFlowProvider>
      <EventsPageContent />
    </ReactFlowProvider>
  );
}
