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

function EventsPageContent() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [selected, setSelected] = useState(0);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [filter, setFilter] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>("24h");
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
          minWidth: "200px",
          minHeight: "60px",
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
              $ loading attack flows...
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
              $ no attack flows found
            </p>
            <p className="text-sm text-slate-500 font-mono mt-2">
              waiting for sigma correlations...
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
              ai-detector://attack-flow-analyzer --sigma-rules --correlations
            </span>
          </div>

          {/* Command Interface */}
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4 text-sm font-mono">
              <span className="text-blue-400">sigma@flow-analyzer:~$</span>
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="filter attack flows by hostname, id, or label..."
                  className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded px-3 py-2 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-slate-800/50 border border-slate-600/50 rounded px-3 py-2 text-slate-300 focus:outline-none focus:border-blue-500/50"
                >
                  <option value="1h">Last 1h</option>
                  <option value="24h">Last 24h</option>
                  <option value="7d">Last 7d</option>
                  <option value="30d">Last 30d</option>
                </select>
              </div>
            </div>

            {/* Status Info */}
            <div className="flex items-center gap-6 text-xs font-mono">
              <span className="text-slate-400">
                Attack Flows:{" "}
                <span className="text-cyan-400">{filteredTraces.length}</span>
              </span>
              <span className="text-slate-400">
                Anomalies: <span className="text-red-400">{anomalyCount}</span>
              </span>
              <span className="text-slate-400">
                Threat Level: <span className={threatColor}>{threatLevel}</span>
              </span>
              <span className="text-slate-400">
                Sigma Correlations:{" "}
                <span className="text-green-400">ACTIVE</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-row gap-6 h-[calc(100vh-280px)] min-h-0"
        >
          {/* Attack Flow Visualization */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 flex flex-col bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden"
          >
            {/* Terminal Window Header */}
            <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-slate-400 text-sm font-mono ml-2">
                attack-flow --visual --sigma-correlation --mitre-attack
              </span>
            </div>

            {/* Flow Chart */}
            <div className="flex-1 w-full bg-slate-900/50">
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
            </div>
          </motion.section>

          {/* Trace List */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
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
                trace-list --sigma-matches
              </span>
            </div>

            <div className="p-6 flex flex-col flex-1 min-h-0">
              <h2 className="text-lg font-bold text-cyan-400 font-mono mb-4">
                Attack Flow Traces
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
                          {trace.label}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 truncate mb-1">
                        {trace.prompt_input}
                      </div>
                      <div className="text-xs text-slate-500 truncate mb-1">
                        ID: {trace.trace_id}
                      </div>
                      <div className="text-xs text-slate-400">
                        {trace.events.length} events •{" "}
                        {trace.sigma_match.length} sigma rules
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(trace.timestamp).toLocaleString()}
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
                    event-analyzer --detailed --sigma-match
                  </span>
                  <button
                    className="ml-auto text-slate-400 hover:text-red-400 text-lg font-bold"
                    onClick={() => setSelectedNode(null)}
                  >
                    ×
                  </button>
                </div>

                <h3 className="text-lg font-bold mb-4 text-cyan-400">
                  Attack Flow Event Details
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400">Event Type:</span>
                      <div className="text-purple-300 font-bold">
                        {nodeDetail.event.event_type}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Event Index:</span>
                      <div className="text-blue-300">{nodeDetail.index}</div>
                    </div>
                  </div>

                  {nodeDetail.event.process_name && (
                    <div>
                      <span className="text-slate-400">Process:</span>
                      <div className="text-green-300 bg-green-500/10 p-2 rounded border border-green-500/20 mt-1">
                        {nodeDetail.event.process_name}
                      </div>
                    </div>
                  )}

                  {nodeDetail.event.command_line && (
                    <div>
                      <span className="text-slate-400">Command Line:</span>
                      <div className="text-yellow-300 bg-yellow-500/10 p-2 rounded border border-yellow-500/20 mt-1 break-all text-xs">
                        {nodeDetail.event.command_line}
                      </div>
                    </div>
                  )}

                  {(nodeDetail.event as any).parent_process && (
                    <div>
                      <span className="text-slate-400">Parent Process:</span>
                      <div className="text-orange-300">
                        {(nodeDetail.event as any).parent_process}
                      </div>
                    </div>
                  )}

                  {(nodeDetail.event as any).destination_ip && (
                    <div>
                      <span className="text-slate-400">
                        Network Connection:
                      </span>
                      <div className="text-red-300">
                        {(nodeDetail.event as any).destination_ip}:
                        {(nodeDetail.event as any).destination_port}
                      </div>
                    </div>
                  )}

                  {(nodeDetail.event as any).registry_path && (
                    <div>
                      <span className="text-slate-400">Registry Path:</span>
                      <div className="text-pink-300 break-all text-xs">
                        {(nodeDetail.event as any).registry_path}
                      </div>
                    </div>
                  )}

                  {(nodeDetail.event as any).file_path && (
                    <div>
                      <span className="text-slate-400">File Path:</span>
                      <div className="text-violet-300 break-all text-xs">
                        {(nodeDetail.event as any).file_path}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                    <div>
                      <span className="text-slate-400">Host:</span>
                      <div className="text-cyan-300">{nodeDetail.host}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">OS:</span>
                      <div className="text-cyan-300">{nodeDetail.os}</div>
                    </div>
                  </div>

                  {nodeDetail.sigma.length > 0 && (
                    <div>
                      <span className="text-slate-400">
                        Sigma Rule Matches:
                      </span>
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
