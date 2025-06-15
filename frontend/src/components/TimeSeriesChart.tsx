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
  title = "이상 탐지 점수 추이",
  color = "#4a5568",
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
      return date.toLocaleTimeString("ko-KR", {
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
        borderColor: color, // app-primary
        backgroundColor: `${color}1A`, // app-primary with opacity
        pointBackgroundColor: chartData.map((item) =>
          item.label === "Anomaly" ? "#ef4444" : "#4a5568"
        ),
        pointBorderColor: chartData.map((item) =>
          item.label === "Anomaly" ? "#dc2626" : "#374151"
        ),
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
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
          color: "#2d3748", // app-text
          font: {
            size: 12,
            weight: "normal" as const,
          },
        },
      },
      title: {
        display: true,
        text: title,
        color: "#2d3748", // app-text
        font: {
          size: 16,
          weight: "bold" as const,
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#2d3748",
        bodyColor: "#4a5568",
        borderColor: "#a2b2c1",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function (context: any) {
            const dataIndex = context.dataIndex;
            const item = chartData[dataIndex];
            return [
              `점수: ${context.parsed.y.toFixed(2)}`,
              `상태: ${item.label}`,
              `시간: ${item.timestamp}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(162, 178, 193, 0.2)",
          drawBorder: false,
        },
        ticks: {
          color: "#718096", // app-secondary
          font: {
            size: 11,
          },
          maxTicksLimit: 8,
        },
      },
      y: {
        min: 0,
        max: 1,
        grid: {
          color: "rgba(162, 178, 193, 0.2)",
          drawBorder: false,
        },
        ticks: {
          color: "#718096", // app-secondary
          font: {
            size: 11,
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
      className="card w-full h-full flex flex-col"
    >
      <div className="flex-1 min-h-0 p-4">
        <Line data={chartConfig} options={options} />
      </div>
    </motion.div>
  );
}
