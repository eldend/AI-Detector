"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDashboard } from "@/context/DashboardContext";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import TimeSeriesChart from "@/components/TimeSeriesChart";
import DonutChart from "@/components/DonutChart";
import EventTable from "@/components/EventTable";
import EventDetail from "@/components/EventDetail";
import BarChart from "@/components/BarChart";
import HeatMap from "@/components/HeatMap";
import DashboardSettings from "@/components/DashboardSettings";
import { fetchEvents, fetchStats } from "@/lib/api";
import { Event, Stats, EventDetail as EventDetailType } from "@/types/event";

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayouts = {
  lg: [
    { i: "stat1", x: 0, y: 0, w: 3, h: 2 },
    { i: "stat2", x: 3, y: 0, w: 3, h: 2 },
    { i: "stat3", x: 6, y: 0, w: 3, h: 2 },
    { i: "stat4", x: 9, y: 0, w: 3, h: 2 },
    { i: "timeseries", x: 0, y: 2, w: 8, h: 4 },
    { i: "donut", x: 8, y: 2, w: 4, h: 4 },
    { i: "bar", x: 0, y: 6, w: 6, h: 4 },
    { i: "heatmap", x: 6, y: 6, w: 6, h: 4 },
    { i: "events", x: 0, y: 10, w: 12, h: 5 },
  ],
};

// Event를 EventDetail로 변환하는 함수
function convertEventToEventDetail(event: Event): EventDetailType {
  return {
    id: event.id,
    date: new Date(event.timestamp).toLocaleString(),
    anomalyScore: event.anomaly,
    incident: `Security event detected: ${event.event} by user ${event.user}. ${
      event.label === "Anomaly"
        ? "This activity has been flagged as anomalous and requires investigation."
        : "This appears to be normal activity."
    }`,
    rowData: {
      ip_address: "192.168.1." + (Math.floor(Math.random() * 254) + 1),
      user: event.user,
      number: event.id.toString(),
      location: "Unknown",
      timestamp: event.timestamp,
      event_type: event.event,
      anomaly_score: event.anomaly.toFixed(3),
      status: event.label,
    },
  };
}

export default function Dashboard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    anomalies: 0,
    avgAnomaly: 0,
    highestScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const { widgets } = useDashboard();

  // Load data on mount (without auto-refresh)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [eventsData, statsData] = await Promise.all([
          fetchEvents(),
          fetchStats(),
        ]);
        setEvents(eventsData);
        setStats(statsData);
        setError(null);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load security data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Debug: 위젯 정보 출력
  useEffect(() => {
    console.log("Current widgets:", widgets);
    console.log("Events:", events.length);
    console.log("Stats:", stats);
  }, [widgets, events, stats]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event);
  }, []);

  // 실제 위젯 데이터로부터 레이아웃 생성 (메모이제이션)
  const currentLayout = useMemo(() => {
    return widgets
      .filter((widget) => widget.visible)
      .map((widget) => ({
        i: widget.id,
        x: widget.position.x,
        y: widget.position.y,
        w: widget.position.w,
        h: widget.position.h,
      }));
  }, [widgets]);

  // Calculate threat level (메모이제이션)
  const threatData = useMemo(() => {
    const threatLevel =
      stats.anomalies > 10 ? "HIGH" : stats.anomalies > 5 ? "MEDIUM" : "LOW";
    const threatColor =
      threatLevel === "HIGH"
        ? "text-red-400"
        : threatLevel === "MEDIUM"
        ? "text-yellow-400"
        : "text-green-400";
    return { threatLevel, threatColor };
  }, [stats.anomalies]);

  // WidgetWrapper를 메모이제이션
  const WidgetWrapper = useCallback(
    ({ children, title, onRemove, widgetType }: any) => (
      <div className="h-full bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-lg overflow-hidden font-mono relative z-0">
        {/* Terminal Header */}
        <div className="bg-slate-800/70 border-b border-slate-700/50 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-400 text-sm ml-2">
              {title}.terminal
            </span>
          </div>
          <button
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Terminal Command */}
        <div className="px-4 py-1 bg-slate-800/30 border-b border-slate-700/30">
          <div className="text-xs text-green-400">
            $ {getTerminalCommand(widgetType)}
          </div>
        </div>

        {/* Widget Content */}
        <div className="p-4 h-full overflow-hidden">{children}</div>
      </div>
    ),
    []
  );

  const getTerminalCommand = useCallback((type: string): string => {
    const commands: Record<string, string> = {
      stats: "monitor --stats --realtime",
      timeseries: "plot --timeseries --anomaly-detection",
      donutchart: "analyze --threat-distribution --pie-chart",
      barchart: "analyze --bar-chart --category-breakdown",
      heatmap: "visualize --heatmap --correlation-matrix",
      eventtable:
        "tail -f /var/log/security/events.log | grep -E 'ALERT|CRITICAL'",
      eventdetail: "inspect --event-detail --forensics",
    };
    return commands[type] || "execute --widget";
  }, []);

  // 각 위젯을 개별적으로 메모이제이션
  const statsWidget = useMemo(
    () =>
      loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-green-400 font-mono text-sm animate-pulse">
            Loading system metrics...
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-red-400 font-mono text-sm">Error: {error}</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Events */}
          <div className="bg-slate-800/30 rounded border border-slate-700/50 p-4 hover:bg-slate-800/50 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded border border-blue-500/30 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-slate-400 text-xs font-mono uppercase tracking-wide w-24">
                  Total Events
                </div>
                <div className="text-blue-400 text-xl font-mono font-bold">
                  {stats.totalEvents}
                </div>
              </div>
            </div>
            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full animate-pulse"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          {/* Anomalies */}
          <div className="bg-slate-800/30 rounded border border-slate-700/50 p-4 hover:bg-slate-800/50 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-red-500/20 rounded border border-red-500/30 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-slate-400 text-xs font-mono uppercase tracking-wide w-24">
                  Anomalies
                </div>
                <div className="text-red-400 text-xl font-mono font-bold">
                  {stats.anomalies}
                </div>
              </div>
            </div>
            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full animate-pulse"
                style={{
                  width: `${Math.min(
                    100,
                    (stats.anomalies / stats.totalEvents) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-slate-800/30 rounded border border-slate-700/50 p-4 hover:bg-slate-800/50 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-yellow-500/20 rounded border border-yellow-500/30 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-slate-400 text-xs font-mono uppercase tracking-wide w-24">
                  Avg Score
                </div>
                <div className="text-yellow-400 text-xl font-mono font-bold">
                  {stats.avgAnomaly.toFixed(3)}
                </div>
              </div>
            </div>
            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full animate-pulse"
                style={{ width: `${stats.avgAnomaly * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Threat Level */}
          <div className="bg-slate-800/30 rounded border border-slate-700/50 p-4 hover:bg-slate-800/50 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-8 h-8 ${
                  threatData.threatLevel === "HIGH"
                    ? "bg-red-500/20 border-red-500/30"
                    : threatData.threatLevel === "MEDIUM"
                    ? "bg-yellow-500/20 border-yellow-500/30"
                    : "bg-green-500/20 border-green-500/30"
                } rounded border flex items-center justify-center`}
              >
                <svg
                  className={`w-4 h-4 ${
                    threatData.threatLevel === "HIGH"
                      ? "text-red-400"
                      : threatData.threatLevel === "MEDIUM"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-slate-400 text-xs font-mono uppercase tracking-wide w-24">
                  Threat Level
                </div>
                <div
                  className={`text-xl font-mono font-bold ${threatData.threatColor}`}
                >
                  {threatData.threatLevel}
                </div>
              </div>
            </div>
            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full animate-pulse ${
                  threatData.threatLevel === "HIGH"
                    ? "bg-red-500"
                    : threatData.threatLevel === "MEDIUM"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${
                    threatData.threatLevel === "HIGH"
                      ? 100
                      : threatData.threatLevel === "MEDIUM"
                      ? 60
                      : 30
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      ),
    [loading, error, stats, threatData]
  );

  const eventTableWidget = useMemo(
    () =>
      loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-green-400 font-mono text-sm animate-pulse">
            Loading events...
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-red-400 font-mono text-sm">Error: {error}</div>
        </div>
      ) : (
        <EventTable events={events} onEventSelect={handleEventClick} />
      ),
    [loading, error, events, handleEventClick]
  );

  const eventDetailWidget = useMemo(
    () =>
      selectedEvent ? (
        <EventDetail event={convertEventToEventDetail(selectedEvent)} />
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-slate-500 text-4xl mb-4">◯</div>
            <div className="text-slate-400 text-sm mb-2">No Event Selected</div>
            <div className="text-slate-500 text-xs">
              Click on an event in the table to view details
            </div>
          </div>
        </div>
      ),
    [selectedEvent]
  );

  const renderWidget = useCallback(
    (widget: any) => {
      switch (widget.type) {
        case "stats":
          return (
            <WidgetWrapper
              title="system-monitor"
              onRemove={() => console.log("Remove widget:", widget.id)}
              widgetType="stats"
            >
              {statsWidget}
            </WidgetWrapper>
          );
        case "timeseries":
          return (
            <WidgetWrapper
              title="anomaly-detection"
              onRemove={() => console.log("Remove widget:", widget.id)}
              widgetType="timeseries"
            >
              <TimeSeriesChart />
            </WidgetWrapper>
          );
        case "donutchart":
          return (
            <WidgetWrapper
              title="threat-analysis"
              onRemove={() => console.log("Remove widget:", widget.id)}
              widgetType="donutchart"
            >
              <DonutChart />
            </WidgetWrapper>
          );
        case "barchart":
          return (
            <WidgetWrapper
              title="category-breakdown"
              onRemove={() => console.log("Remove widget:", widget.id)}
              widgetType="barchart"
            >
              <BarChart />
            </WidgetWrapper>
          );
        case "heatmap":
          return (
            <WidgetWrapper
              title="correlation-matrix"
              onRemove={() => console.log("Remove widget:", widget.id)}
              widgetType="heatmap"
            >
              <HeatMap />
            </WidgetWrapper>
          );
        case "eventtable":
          return (
            <WidgetWrapper
              title="security-events"
              onRemove={() => console.log("Remove widget:", widget.id)}
              widgetType="eventtable"
            >
              {eventTableWidget}
            </WidgetWrapper>
          );
        case "eventdetail":
          return (
            <WidgetWrapper
              title="event-forensics"
              onRemove={() => console.log("Remove widget:", widget.id)}
              widgetType="eventdetail"
            >
              {eventDetailWidget}
            </WidgetWrapper>
          );
        default:
          return null;
      }
    },
    [statsWidget, eventTableWidget, eventDetailWidget]
  );

  return (
    <DashboardLayout
      onLogout={handleLogout}
      onOpenSettings={handleOpenSettings}
    >
      <div className="h-full relative z-10">
        {/* Grid Layout */}
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: currentLayout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          onLayoutChange={() => {}}
          isDraggable={true}
          isResizable={true}
          margin={[16, 16]}
        >
          {widgets
            .filter((widget) => widget.visible)
            .map((widget) => (
              <div key={widget.id}>{renderWidget(widget)}</div>
            ))}
        </ResponsiveGridLayout>

        {/* Settings Modal */}
        {isSettingsOpen && (
          <DashboardSettings
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
