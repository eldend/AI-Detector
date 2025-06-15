"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  normalCount?: number;
  anomalyCount?: number;
  title?: string;
}

export default function DonutChart({
  normalCount = 4,
  anomalyCount = 10,
  title = "이상 탐지 분포",
}: DonutChartProps) {
  const total = normalCount + anomalyCount;
  const normalPercentage = ((normalCount / total) * 100).toFixed(1);
  const anomalyPercentage = ((anomalyCount / total) * 100).toFixed(1);

  const data = {
    labels: ["Normal", "Anomaly"],
    datasets: [
      {
        data: [normalCount, anomalyCount],
        backgroundColor: [
          "#4a5568", // app-primary for normal
          "#ef4444", // red for anomaly
        ],
        borderColor: ["#374151", "#dc2626"],
        borderWidth: 2,
        hoverBackgroundColor: [
          "#718096", // app-secondary
          "#f87171",
        ],
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#2d3748", // app-text
          font: {
            size: 10,
            weight: "normal" as const,
          },
          padding: 8,
          usePointStyle: true,
          pointStyle: "circle",
        },
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
            const label = context.label;
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value}건 (${percentage}%)`;
          },
        },
      },
    },
    cutout: "65%",
    elements: {
      arc: {
        borderRadius: 4,
      },
    },
    layout: {
      padding: 10,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white-900 backdrop-blur-md border border-app-accent-200 rounded-xl p-4 h-full flex flex-col"
    >
      <div className="text-center mb-2 flex-shrink-0">
        <h3 className="text-sm font-semibold text-app-text mb-1">{title}</h3>
        <div className="text-xs text-app-secondary">총 {total}건의 이벤트</div>
      </div>

      <div className="relative flex-1 min-h-0 mb-2 flex items-center justify-center no-drag">
        <div className="w-full h-full relative">
          <Doughnut data={data} options={options} />

          {/* Center text */}
          <div className="donut-center-text">
            <div className="text-center">
              <div
                className="font-bold text-app-primary whitespace-nowrap"
                style={{ fontSize: "clamp(0.875rem, 2vw, 1.125rem)" }}
              >
                {anomalyPercentage}%
              </div>
              <div
                className="text-app-secondary whitespace-nowrap"
                style={{ fontSize: "clamp(0.625rem, 1.2vw, 0.75rem)" }}
              >
                이상 비율
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-2 text-center flex-shrink-0 no-drag">
        <div className="bg-app-accent-100 rounded-lg p-2">
          <div className="text-sm font-semibold text-app-primary">
            {normalCount}
          </div>
          <div className="text-xs text-app-secondary">Normal</div>
        </div>
        <div className="bg-red-50 rounded-lg p-2">
          <div className="text-sm font-semibold text-red-600">
            {anomalyCount}
          </div>
          <div className="text-xs text-red-500">Anomaly</div>
        </div>
      </div>
    </motion.div>
  );
}
