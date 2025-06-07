'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  icon: 'network' | 'warning' | 'chart' | 'monitor';
  color: 'blue' | 'purple' | 'cyan' | 'red';
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'network':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'chart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'monitor':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'blue':
        return 'from-blue-500 to-blue-700 border-blue-600';
      case 'purple':
        return 'from-purple-500 to-purple-700 border-purple-600';
      case 'cyan':
        return 'from-cyan-500 to-cyan-700 border-cyan-600';
      case 'red':
        return 'from-red-500 to-red-700 border-red-600';
      default:
        return 'from-blue-500 to-blue-700 border-blue-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`card stat-card bg-gradient-to-br ${getColorClass()} border-2`}
    >
      <div className="flex justify-between items-start">
        <div className="text-white opacity-80">
          {getIcon()}
        </div>
        <h3 className="text-lg font-medium text-white">{title}</h3>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
}

