"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Responsive, WidthProvider } from "react-grid-layout";
import StatCard from "@/components/StatCard";
import EventTable from "@/components/EventTable";
import EventDetail from "@/components/EventDetail";
import TimeSeriesChart from "@/components/TimeSeriesChart";
import DonutChart from "@/components/DonutChart";
import BarChart from "@/components/BarChart";
import HeatMap from "@/components/HeatMap";
import DashboardSettings from "@/components/DashboardSettings";
import { Event, EventDetail as EventDetailType, Stats } from "@/types/event";
import { fetchEvents, fetchEventDetail, fetchStats } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";

// Import CSS for react-grid-layout
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

function DashboardContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventDetailType | null>(
    null
  );
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    anomalies: 0,
    avgAnomaly: 0,
    highestScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { isLoggedIn, logout, isLoading } = useAuth();
  const { widgets, updateWidgetPosition, deleteWidget, toggleWidget } =
    useDashboard();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  const loadData = async () => {
    if (!isLoggedIn) return;
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
      setError("데이터를 불러오는데 실패했습니다.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const handleEventSelect = async (eventId: number) => {
    try {
      const eventDetail = await fetchEventDetail(eventId);
      setSelectedEvent(eventDetail);
    } catch (err) {
      console.error("Error loading event detail:", err);
      setError("이벤트 상세 정보를 불러오는데 실패했습니다.");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDeleteWidget = (widgetId: string) => {
    deleteWidget(widgetId);
  };

  // Prepare chart data from events
  const chartData = events.map((event) => ({
    timestamp: event.timestamp,
    anomalyScore: event.anomaly,
    label: event.label,
  }));

  // Calculate normal vs anomaly counts
  const normalCount = events.filter((event) => event.label === "Normal").length;
  const anomalyCount = events.filter(
    (event) => event.label === "Anomaly"
  ).length;

  // Prepare bar chart data (user-based)
  const userStats = events.reduce((acc, event) => {
    if (!acc[event.user]) {
      acc[event.user] = { user: event.user, anomalyCount: 0, normalCount: 0 };
    }
    if (event.label === "Anomaly") {
      acc[event.user].anomalyCount++;
    } else {
      acc[event.user].normalCount++;
    }
    return acc;
  }, {} as Record<string, { user: string; anomalyCount: number; normalCount: number }>);

  const barChartData = Object.values(userStats);

  // Handle layout change
  const handleLayoutChange = (layout: any) => {
    layout.forEach((item: any) => {
      updateWidgetPosition(item.i, {
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      });
    });
  };

  // Create layout from widgets with flexible sizing
  const layout = widgets.map((widget) => ({
    i: widget.id,
    x: widget.position.x,
    y: widget.position.y,
    w: widget.position.w,
    h: widget.position.h,
    minW: 2,
    minH: 2,
    maxW: 12,
    maxH: 12,
  }));

  // Filter visible widgets
  const visibleWidgets = widgets.filter((widget) => widget.visible);

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl">로그인이 필요합니다.</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl text-danger">{error}</div>
      </main>
    );
  }

  return (
    <DashboardLayout
      onLogout={handleLogout}
      onOpenSettings={() => setIsSettingsOpen(true)}
    >
      <DashboardSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <div className="dashboard-grid-container">
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          onLayoutChange={handleLayoutChange}
          isDraggable={true}
          isResizable={true}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          useCSSTransforms={true}
          draggableCancel=".no-drag"
        >
          {visibleWidgets.map((widget) => {
            switch (widget.type) {
              case "stats":
                return (
                  <div
                    key={widget.id}
                    className="widget-container relative group"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWidget(widget.id);
                      }}
                      className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 no-drag"
                      title="위젯 삭제"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <div className="card h-full p-4">
                      <h3 className="text-lg font-semibold text-app-text mb-4">
                        {widget.config?.title || "시스템 통계"}
                      </h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                          title="Total Event"
                          value={stats.totalEvents.toString()}
                          icon="network"
                          color="blue"
                        />
                        <StatCard
                          title="Anomalies"
                          value={stats.anomalies.toString()}
                          icon="warning"
                          color="purple"
                        />
                        <StatCard
                          title="Average Anomaly"
                          value={stats.avgAnomaly.toFixed(2)}
                          icon="chart"
                          color="cyan"
                        />
                        <StatCard
                          title="Highest Score"
                          value={stats.highestScore.toFixed(2)}
                          icon="monitor"
                          color="red"
                        />
                      </div>
                    </div>
                  </div>
                );

              case "timeseries":
                return (
                  <div
                    key={widget.id}
                    className="widget-container relative group"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWidget(widget.id);
                      }}
                      className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 no-drag"
                      title="위젯 삭제"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <TimeSeriesChart
                      data={chartData}
                      title={widget.config?.title}
                      color={widget.config?.color}
                    />
                  </div>
                );

              case "eventtable":
                return (
                  <div
                    key={widget.id}
                    className="widget-container relative group"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWidget(widget.id);
                      }}
                      className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 no-drag"
                      title="위젯 삭제"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <div className="card h-full flex flex-col">
                      <h2 className="text-xl font-semibold mb-4 px-6 pt-6">
                        {widget.config?.title || "이벤트 로그"}
                      </h2>
                      <div className="flex-1 min-h-0 mx-6 mb-6 border border-app-accent-200 rounded-lg overflow-hidden no-drag">
                        <div className="h-full overflow-y-auto">
                          <EventTable
                            events={events}
                            onEventSelect={handleEventSelect}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );

              case "donutchart":
                return (
                  <div
                    key={widget.id}
                    className="widget-container relative group"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWidget(widget.id);
                      }}
                      className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 no-drag"
                      title="위젯 삭제"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <DonutChart
                      normalCount={normalCount}
                      anomalyCount={anomalyCount}
                      title={widget.config?.title}
                    />
                  </div>
                );

              case "barchart":
                return (
                  <div
                    key={widget.id}
                    className="widget-container relative group"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWidget(widget.id);
                      }}
                      className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 no-drag"
                      title="위젯 삭제"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <BarChart
                      data={barChartData}
                      title={widget.config?.title}
                      color={widget.config?.color}
                    />
                  </div>
                );

              case "heatmap":
                return (
                  <div
                    key={widget.id}
                    className="widget-container relative group"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWidget(widget.id);
                      }}
                      className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 no-drag"
                      title="위젯 삭제"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <HeatMap title={widget.config?.title} />
                  </div>
                );

              case "eventdetail":
                return (
                  <div
                    key={widget.id}
                    className="widget-container relative group"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWidget(widget.id);
                      }}
                      className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 no-drag"
                      title="위젯 삭제"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <EventDetail
                      event={selectedEvent}
                      title={widget.config?.title}
                    />
                  </div>
                );

              default:
                return (
                  <div
                    key={widget.id}
                    className="widget-container relative group"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWidget(widget.id);
                      }}
                      className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 no-drag"
                      title="위젯 삭제"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <div className="card h-full flex items-center justify-center">
                      <p className="text-app-secondary">
                        알 수 없는 위젯 타입: {widget.type}
                      </p>
                    </div>
                  </div>
                );
            }
          })}
        </ResponsiveGridLayout>
      </div>
    </DashboardLayout>
  );
}

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
