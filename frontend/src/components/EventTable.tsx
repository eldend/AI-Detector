"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Event } from "@/types/event";

interface EventTableProps {
  events: Event[];
  onEventSelect: (eventId: number) => void;
}

export default function EventTable({ events, onEventSelect }: EventTableProps) {
  const [sortField, setSortField] = useState<keyof Event>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof Event) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="h-full flex flex-col no-drag">
      {/* Fixed Header */}
      <div className="bg-app-accent-50 border-b border-app-accent-200 sticky top-0 z-10">
        <table className="w-full table-fixed">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("timestamp")}
                className="cursor-pointer text-center text-app-text font-semibold py-3 px-2 hover:bg-app-accent-100 transition-colors text-xs w-1/5"
              >
                Timestamp{" "}
                {sortField === "timestamp" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("user")}
                className="cursor-pointer text-center text-app-text font-semibold py-3 px-2 hover:bg-app-accent-100 transition-colors text-xs w-1/5"
              >
                User{" "}
                {sortField === "user" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("anomaly")}
                className="cursor-pointer text-center text-app-text font-semibold py-3 px-2 hover:bg-app-accent-100 transition-colors text-xs w-1/5"
              >
                Anomaly{" "}
                {sortField === "anomaly" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="text-center text-app-text font-semibold py-3 px-2 text-xs w-1/5">
                Label
              </th>
              <th
                onClick={() => handleSort("event")}
                className="cursor-pointer text-center text-app-text font-semibold py-3 px-2 hover:bg-app-accent-100 transition-colors text-xs w-1/5"
              >
                Event{" "}
                {sortField === "event" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full table-fixed">
          <tbody className="divide-y divide-app-accent-200">
            {sortedEvents.map((event) => (
              <motion.tr
                key={event.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventSelect(event.id);
                }}
                className="cursor-pointer hover:bg-app-accent-100 transition-colors"
              >
                <td className="align-middle text-center py-3 px-2 text-app-text text-xs w-1/5 truncate">
                  {event.timestamp}
                </td>
                <td className="align-middle text-center py-3 px-2 text-app-text text-xs w-1/5 truncate">
                  {event.user}
                </td>
                <td className="align-middle text-center py-3 px-2 text-app-text font-medium text-xs w-1/5">
                  {event.anomaly}
                </td>
                <td className="align-middle text-center py-3 px-2 w-1/5">
                  <div className="flex items-center justify-center">
                    <span
                      className={`anomaly-badge text-xs ${
                        event.label === "Anomaly"
                          ? "anomaly-badge-danger"
                          : "anomaly-badge-normal"
                      }`}
                    >
                      {event.label}
                    </span>
                  </div>
                </td>
                <td className="align-middle text-center py-3 px-2 text-app-text text-xs w-1/5 truncate">
                  {event.event}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
