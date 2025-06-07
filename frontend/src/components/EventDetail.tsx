'use client';

import { motion } from 'framer-motion';
import { EventDetail as EventDetailType } from '@/types/event';

interface EventDetailProps {
  event: EventDetailType | null;
}

export default function EventDetail({ event }: EventDetailProps) {
  if (!event) {
    return (
      <div className="card h-full flex items-center justify-center">
        <p className="text-gray-400">이벤트를 선택하여 상세 정보를 확인하세요</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score < 0.5) return 'text-primary';
    if (score < 0.8) return 'text-warning';
    return 'text-danger';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="card h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">Event Detail</h2>
        <span className="text-sm text-gray-400">{event.date}</span>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg mb-2">Anomaly Score</h3>
        <div className="flex items-center">
          <span className={`text-4xl font-bold ${getScoreColor(event.anomalyScore)}`}>
            {event.anomalyScore}
          </span>
          <span className={`ml-3 anomaly-badge ${
            event.anomalyScore < 0.5 
              ? 'anomaly-badge-normal' 
              : event.anomalyScore < 0.8 
                ? 'anomaly-badge-warning' 
                : 'anomaly-badge-danger'
          }`}>
            {event.anomalyScore < 0.5 ? 'Normal' : 'Anomaly'}
          </span>
        </div>
        <div className="w-full bg-dark-DEFAULT rounded-full h-2.5 mt-2">
          <div 
            className={`h-2.5 rounded-full ${
              event.anomalyScore < 0.5 
                ? 'bg-primary' 
                : event.anomalyScore < 0.8 
                  ? 'bg-warning' 
                  : 'bg-danger'
            }`}
            style={{ width: `${event.anomalyScore * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg mb-2">Incident</h3>
        <p className="text-gray-300">{event.incident}</p>
      </div>
      
      <div>
        <h3 className="text-lg mb-2">Row Data</h3>
        <div className="bg-dark-DEFAULT p-4 rounded-md font-mono text-sm overflow-auto max-h-48">
          {Object.entries(event.rowData).map(([key, value]) => (
            <div key={key} className="mb-1">
              <span className="text-gray-400">{key}:</span> <span className="text-gray-200">"{value}"</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button className="btn bg-dark-lighter hover:bg-dark-DEFAULT">Ignore</button>
        <button className="btn btn-danger">Take Action</button>
      </div>
    </motion.div>
  );
}

