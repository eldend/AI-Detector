"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/StatCard";
import EventTable from "@/components/EventTable";
import EventDetail from "@/components/EventDetail";
import { Event, EventDetail as EventDetailType, Stats } from "@/types/event";
import { fetchEvents, fetchEventDetail, fetchStats } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
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

  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

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

  const handleRefresh = () => {
    loadData();
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isLoggedIn || loading) {
    return (
      <main className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl">
          {loading ? "로딩 중..." : "로그인이 필요합니다."}
        </div>
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
    <DashboardLayout onRefresh={handleRefresh} onLogout={handleLogout}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Timestamp</h2>
            <EventTable events={events} onEventSelect={handleEventSelect} />
          </div>
        </div>
        <div>
          <EventDetail event={selectedEvent} />
        </div>
      </div>
    </DashboardLayout>
  );
}
