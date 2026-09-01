import React from 'react';
import { DoughnutChart } from './Charts';

export const TaskStatusChart = ({ tasks = [] }) => {
  const counts = {
    pending: 0,
    in_progress: 0,
    submitted: 0,
    completed: 0,
    overdue: 0
  };

  tasks.forEach(t => {
    const status = t.status || 'pending';
    if (counts[status] !== undefined) {
      counts[status]++;
    } else if (status === 'reviewed') {
      counts.completed++; // map reviewed to completed/reviewed category if needed, or group
    } else {
      counts.pending++;
    }
  });

  const chartData = {
    labels: ['Pending', 'In Progress', 'Submitted', 'Completed', 'Overdue'],
    datasets: [
      {
        data: [
          counts.pending,
          counts.in_progress,
          counts.submitted,
          counts.completed,
          counts.overdue
        ],
        backgroundColor: [
          '#A0A8B1', // Gray (Pending)
          '#F59E0B', // Amber (In Progress)
          '#3B82F6', // Blue (Submitted)
          '#22C55E', // Green (Completed)
          '#EF4444'  // Red (Overdue)
        ],
        borderWidth: 1,
        borderColor: '#FFFFFF'
      }
    ]
  };

  return (
    <div style={{ position: 'relative', height: '100%', minHeight: '250px' }}>
      <DoughnutChart data={chartData} />
    </div>
  );
};

export default TaskStatusChart;
