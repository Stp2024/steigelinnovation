import React from 'react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register necessary Chart.js controllers/scales
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Unified Design System Colors for Charts
const defaultColor = '#B8923D'; // Steigel Gold primary
const gridColor = 'rgba(184, 146, 61, 0.15)';
const textColor = '#2E333F';

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: { family: 'Inter', size: 11 },
        color: textColor
      }
    },
    tooltip: {
      backgroundColor: '#11141D',
      titleFont: { family: 'Outfit', size: 12 },
      bodyFont: { family: 'Inter', size: 12 },
      padding: 10,
      cornerRadius: 8
    }
  },
  scales: {
    x: {
      grid: { color: gridColor },
      ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
    },
    y: {
      grid: { color: gridColor },
      ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
    }
  }
};

export const LineChart = ({ data, options = {} }) => {
  const mergedOptions = { ...commonOptions, ...options };
  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Line data={data} options={mergedOptions} />
    </div>
  );
};

export const BarChart = ({ data, options = {} }) => {
  const mergedOptions = { ...commonOptions, ...options };
  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Bar data={data} options={mergedOptions} />
    </div>
  );
};

export const DoughnutChart = ({ data, options = {} }) => {
  // Hide grids for polar/doughnut charts
  const doughnutOptions = {
    ...commonOptions,
    scales: {}, // Remove x/y axes for doughnut
    ...options
  };
  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Doughnut data={data} options={doughnutOptions} />
    </div>
  );
};

export const RadarChart = ({ data, options = {} }) => {
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { font: { family: 'Inter', size: 11 }, color: textColor }
      }
    },
    scales: {
      r: {
        angleLines: { color: '#E2E8F0' },
        grid: { color: '#E2E8F0' },
        pointLabels: { color: textColor, font: { family: 'Inter', size: 10 } },
        ticks: { backdropColor: 'transparent', color: textColor, font: { size: 9 } }
      }
    },
    ...options
  };
  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Radar data={data} options={radarOptions} />
    </div>
  );
};
