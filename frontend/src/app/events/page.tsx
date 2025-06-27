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
  events: any[]; // 실제 이벤트 타입들을 더 상세하게 정의할 수 있습니다.
  sigma_match: string[];
  prompt_input: string;
}

export default function EventsPage() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [selected, setSelected] = useState(0);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTraces = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/traces");
        const data = await response.json();
        setTraces(data);
      } catch (error) {
        console.error("Failed to fetch traces:", error);
        // 에러 처리 UI를 여기에 추가할 수 있습니다.
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

      return {
        id: String(idx),
        data: {
          label: label,
          event: event,
        },
        position: { x: 0, y: idx * 120 },
        type: "process",
      };
    });

    const newEdges = selectedTrace.events.slice(1).map((_, idx) => ({
      id: `e${idx}-${idx + 1}`,
      source: String(idx),
      target: String(idx + 1),
      type: "straight",
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [selected, traces, setNodes, setEdges]);

  // 선택된 노드의 상세 정보
  const nodeDetail =
    selectedNode && traces[selected]
      ? {
          event: traces[selected].events[Number((selectedNode as any).id)],
          index: (selectedNode as any).id,
          host: traces[selected].host.hostname,
          os: traces[selected].host.os,
          sigma: traces[selected].sigma_match,
        }
      : null;

  if (isLoading) {
    return (
      <DashboardLayout onLogout={() => {}} onOpenSettings={() => {}}>
        <div className="flex items-center justify-center h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-4 border-app-primary-200 border-t-app-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-app-text">트레이스 로딩 중...</p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  if (traces.length === 0) {
    return (
      <DashboardLayout onLogout={() => {}} onOpenSettings={() => {}}>
        <div className="flex items-center justify-center h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-xl text-app-text">
              트레이스를 찾을 수 없습니다.
            </p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout onLogout={() => {}} onOpenSettings={() => {}}>
      <div className="flex flex-col h-full w-full gap-4">
        {/* 상단 도구바 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 border rounded-lg bg-app-background-900 border-app-primary-200"
        >
          <input
            type="text"
            placeholder="트레이스 검색..."
            className="px-3 py-2 rounded-lg bg-app-background-100 border border-app-primary-200 focus:outline-none focus:ring-2 focus:ring-app-primary-300 text-sm"
          />
          <select className="px-3 py-2 rounded-lg bg-app-background-100 border border-app-primary-200 focus:outline-none focus:ring-2 focus:ring-app-primary-300 text-sm">
            <option>최근 1시간</option>
            <option>최근 24시간</option>
            <option>최근 7일</option>
            <option>최근 30일</option>
            <option>사용자 정의</option>
          </select>
          <button className="px-3 py-2 rounded-lg bg-app-primary text-white hover:bg-app-primary-600 transition-colors text-sm">
            전체화면
          </button>
          <button className="px-3 py-2 rounded-lg bg-app-secondary text-white hover:bg-app-secondary-600 transition-colors text-sm">
            새로고침
          </button>
          <button className="px-3 py-2 rounded-lg bg-app-background-100 border border-app-primary-200 hover:bg-app-primary-50 transition-colors text-sm">
            필터
          </button>
          <div className="ml-auto flex items-center gap-2 text-sm text-app-text-400">
            <span>총 {traces.length}개 트레이스</span>
            <span>•</span>
            <span>
              {traces.filter((t) => t.label === "이상").length}개 이상
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-row flex-1 gap-4 min-h-0"
        >
          {/* 가운데: 플로우차트 */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-app-background-900 border-app-primary-200"
          >
            <div className="p-4 border-b border-app-primary-200">
              <h2 className="text-xl font-bold text-app-primary">플로우차트</h2>
            </div>
            <div className="flex-1 w-full h-full">
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
                  maxZoom: 5.0,
                }}
                defaultViewport={{ x: 0, y: 0, zoom: 4.0 }}
                minZoom={0.1}
                maxZoom={5}
                attributionPosition="bottom-left"
                panOnDrag
                panOnScroll
                zoomOnScroll
                zoomOnPinch
                zoomOnDoubleClick
              />
            </div>
          </motion.section>
          {/* 우측: 트레이스 리스트 */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-80 bg-app-background-900 border-l border-app-primary-200 p-6 flex flex-col gap-4 rounded-lg min-h-0"
          >
            <h2 className="text-xl font-bold text-app-primary mb-4">
              이벤트 트레이스 목록
            </h2>
            <ul className="space-y-3 flex-1 overflow-y-auto min-h-0">
              {traces.map((trace, idx) => (
                <motion.li
                  key={trace.trace_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <button
                    onClick={() => {
                      setSelected(idx);
                      setSelectedNode(null);
                    }}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-app-primary-300
                      ${
                        selected === idx
                          ? "bg-app-primary-100 border-app-primary-400 text-app-primary"
                          : "bg-app-background-100 border-app-primary-200 text-app-text-700 hover:bg-app-primary-50"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">
                        {trace.host.hostname}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          trace.label === "이상"
                            ? "bg-danger/20 text-danger"
                            : "bg-app-secondary-200 text-app-secondary"
                        }`}
                      >
                        {trace.label}
                      </span>
                    </div>
                    <div className="text-xs text-app-text-400 truncate">
                      {trace.prompt_input}
                    </div>
                    <div className="text-xs text-app-text-300 mt-1">
                      {trace.trace_id}
                    </div>
                    <div className="text-xs text-app-text-400 mt-1">
                      {trace.events.length} 이벤트 •{" "}
                      {new Date(trace.timestamp).toLocaleString()}
                    </div>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.aside>
        </motion.div>

        {/* 노드 클릭 시 상세 정보 모달 */}
        <AnimatePresence>
          {selectedNode && nodeDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
              onClick={() => setSelectedNode(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl p-8 min-w-[400px] max-w-md border-2 border-app-primary-200 relative"
              >
                <button
                  className="absolute top-2 right-2 text-app-primary hover:text-app-secondary text-xl font-bold"
                  onClick={() => setSelectedNode(null)}
                >
                  ×
                </button>
                <h3 className="text-lg font-bold mb-4 text-app-primary">
                  이벤트 상세 정보
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>이벤트 타입:</strong> {nodeDetail.event.event_type}
                  </div>
                  {nodeDetail.event.process_name && (
                    <div>
                      <strong>프로세스:</strong> {nodeDetail.event.process_name}
                    </div>
                  )}
                  {nodeDetail.event.command_line && (
                    <div>
                      <strong>명령어:</strong> {nodeDetail.event.command_line}
                    </div>
                  )}
                  {(nodeDetail.event as any).parent_process && (
                    <div>
                      <strong>부모 프로세스:</strong>{" "}
                      {(nodeDetail.event as any).parent_process}
                    </div>
                  )}
                  {(nodeDetail.event as any).destination_ip && (
                    <div>
                      <strong>네트워크:</strong>{" "}
                      {(nodeDetail.event as any).destination_ip}:
                      {(nodeDetail.event as any).destination_port}
                    </div>
                  )}
                  {(nodeDetail.event as any).registry_path && (
                    <div>
                      <strong>레지스트리:</strong>{" "}
                      {(nodeDetail.event as any).registry_path}
                    </div>
                  )}
                  {(nodeDetail.event as any).file_path && (
                    <div>
                      <strong>파일:</strong>{" "}
                      {(nodeDetail.event as any).file_path}
                    </div>
                  )}
                  <div>
                    <strong>Host:</strong> {nodeDetail.host}
                  </div>
                  <div>
                    <strong>OS:</strong> {nodeDetail.os}
                  </div>
                  <div>
                    <strong>Sigma:</strong> {nodeDetail.sigma.join(", ")}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
