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
    <div className="table-container">
      <table className="table">
        <thead className="bg-dark-lighter">
          <tr>
            <th
              onClick={() => handleSort("timestamp")}
              className="cursor-pointer"
            >
              Timestamp{" "}
              {sortField === "timestamp" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("user")} className="cursor-pointer">
              User{" "}
              {sortField === "user" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              onClick={() => handleSort("anomaly")}
              className="cursor-pointer"
            >
              Anomaly{" "}
              {sortField === "anomaly" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th>Label</th>
            <th onClick={() => handleSort("event")} className="cursor-pointer">
              Event{" "}
              {sortField === "event" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {sortedEvents.map((event) => (
            <motion.tr
              key={event.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => onEventSelect(event.id)}
              className="cursor-pointer"
            >
              <td>{event.timestamp}</td>
              <td>{event.user}</td>
              <td>{event.anomaly}</td>
              <td>
                <span
                  className={`anomaly-badge ${
                    event.label === "Anomaly"
                      ? "anomaly-badge-danger"
                      : "anomaly-badge-normal"
                  }`}
                >
                  {event.label}
                </span>
              </td>
              <td>{event.event}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
