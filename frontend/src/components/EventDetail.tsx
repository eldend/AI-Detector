"use client";

import { motion } from "framer-motion";
import { EventDetail as EventDetailType } from "@/types/event";

interface EventDetailProps {
  event: EventDetailType | null;
  title?: string;
}

export default function EventDetail({
  event,
  title = "Event Detail",
}: EventDetailProps) {
  if (!event) {
    return (
      <div className="card h-full flex items-center justify-center">
        <p className="text-app-secondary">
          이벤트를 선택하여 상세 정보를 확인하세요
        </p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score < 0.5) return "text-app-primary";
    if (score < 0.8) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressBarColor = (score: number) => {
    if (score < 0.5) return "bg-app-primary";
    if (score < 0.8) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="card h-full w-full flex flex-col overflow-hidden"
    >
      <div className="flex justify-between items-start mb-2 flex-shrink-0 drag-handle">
        <h2 className="text-sm font-semibold text-app-text">{title}</h2>
        <span className="text-xs text-app-secondary">{event.date}</span>
      </div>

      <div className="mb-3 flex-shrink-0 no-drag">
        <h3 className="text-sm mb-1 text-app-text font-medium">
          Anomaly Score
        </h3>
        <div className="flex items-center">
          <span
            className={`text-lg font-bold ${getScoreColor(event.anomalyScore)}`}
          >
            {event.anomalyScore}
          </span>
          <span
            className={`ml-2 anomaly-badge text-xs ${
              event.anomalyScore < 0.5
                ? "anomaly-badge-normal"
                : event.anomalyScore < 0.8
                ? "anomaly-badge-warning"
                : "anomaly-badge-danger"
            }`}
          >
            {event.anomalyScore < 0.5 ? "Normal" : "Anomaly"}
          </span>
        </div>
        <div className="w-full bg-app-accent-200 rounded-full h-1.5 mt-1">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${getProgressBarColor(
              event.anomalyScore
            )}`}
            style={{ width: `${event.anomalyScore * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-3 flex-shrink-0 no-drag">
        <h3 className="text-sm mb-1 text-app-text font-medium">Incident</h3>
        <p className="text-app-secondary text-xs">{event.incident}</p>
      </div>

      <div className="flex-1 min-h-0 mb-2 no-drag">
        <h3 className="text-sm mb-1 text-app-text font-medium">Row Data</h3>
        <div
          className="bg-app-accent-100 border border-app-accent-200 p-2 rounded-md font-mono text-xs overflow-auto"
          style={{ height: "calc(100% - 24px)" }}
        >
          {Object.entries(event.rowData).map(([key, value]) => (
            <div key={key} className="mb-1">
              <span className="text-app-primary font-medium">{key}:</span>{" "}
              <span className="text-app-text">"{value}"</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 flex-shrink-0 pt-2 border-t border-app-accent-200 no-drag">
        <button className="btn bg-app-accent-200 hover:bg-app-accent-300 text-app-text border border-app-accent-300 text-xs px-2 py-1">
          Ignore
        </button>
        <button className="btn btn-danger text-xs px-2 py-1">
          Take Action
        </button>
      </div>
    </motion.div>
  );
}
