"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimeSeriesChartProps {
  data?: Array<{ timestamp: string; anomalyScore: number; label: string }>;
  title?: string;
  color?: string;
}

export default function TimeSeriesChart({
  data,
  title = "Anomaly Score Trend",
  color = "#60a5fa",
}: TimeSeriesChartProps) {
  // Mock data for demonstration - replace with real data
  const mockData = [
    { timestamp: "2023-05-22 20:55", anomalyScore: 0.72, label: "Anomaly" },
    { timestamp: "2023-05-22 20:55", anomalyScore: 0.72, label: "Anomaly" },
    { timestamp: "2023-05-21 13:35", anomalyScore: 0.35, label: "Normal" },
    { timestamp: "2023-05-21 13:35", anomalyScore: 0.35, label: "Normal" },
    { timestamp: "2023-05-19 21:32", anomalyScore: 0.42, label: "Normal" },
    { timestamp: "2023-05-19 21:32", anomalyScore: 0.91, label: "Anomaly" },
    { timestamp: "2023-05-19 21:32", anomalyScore: 0.83, label: "Anomaly" },
    { timestamp: "2023-05-19 21:32", anomalyScore: 0.83, label: "Anomaly" },
  ];

  const chartData = data || mockData;

  // Process data for chart
  const processedData = chartData.map((item, index) => ({
    x: index,
    y: item.anomalyScore,
    timestamp: item.timestamp,
    label: item.label,
  }));

  const chartConfig = {
    labels: chartData.map((item) => {
      const date = new Date(item.timestamp);
      return date.toLocaleTimeString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }),
    datasets: [
      {
        label: "Anomaly Score",
        data: processedData.map((item) => item.y),
        borderColor: "#60a5fa", // Terminal blue
        backgroundColor: "rgba(96, 165, 250, 0.1)", // Terminal blue with opacity
        pointBackgroundColor: chartData.map((item) =>
          item.label === "Anomaly" ? "#f87171" : "#34d399"
        ),
        pointBorderColor: chartData.map((item) =>
          item.label === "Anomaly" ? "#ef4444" : "#10b981"
        ),
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#cbd5e1", // Terminal text color
          font: {
            family: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            size: 11,
            weight: "normal" as const,
          },
        },
      },
      title: {
        display: false, // We'll handle title in the wrapper
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)", // Dark terminal background
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "#475569",
        borderWidth: 1,
        cornerRadius: 6,
        padding: 12,
        titleFont: {
          family: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          size: 12,
        },
        bodyFont: {
          family: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          size: 11,
        },
        callbacks: {
          label: function (context: any) {
            const dataIndex = context.dataIndex;
            const item = chartData[dataIndex];
            return [
              `Score: ${context.parsed.y.toFixed(3)}`,
              `Status: ${item.label}`,
              `Time: ${item.timestamp}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(71, 85, 105, 0.3)", // Terminal grid color
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8", // Terminal secondary text
          font: {
            family: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            size: 10,
          },
          maxTicksLimit: 6,
        },
      },
      y: {
        min: 0,
        max: 1,
        grid: {
          color: "rgba(71, 85, 105, 0.3)", // Terminal grid color
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8", // Terminal secondary text
          font: {
            family: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            size: 10,
          },
          callback: function (value: any) {
            return value.toFixed(1);
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full h-full flex flex-col bg-transparent"
    >
      <div className="flex-1 min-h-0 p-4 terminal-chart-container">
        <Line data={chartConfig} options={options} />
      </div>
    </motion.div>
  );
}
