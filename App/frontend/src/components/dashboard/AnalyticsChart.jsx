import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsChart = ({ theme }) => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Visitors',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: theme === 'dark' ? '#818cf8' : '#4f46e5',
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: theme === 'dark' ? '#818cf8' : '#4f46e5',
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Page Views',
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: theme === 'dark' ? '#f472b6' : '#ec4899',
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: theme === 'dark' ? '#f472b6' : '#ec4899',
        pointRadius: 4,
        pointHoverRadius: 6
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
          font: {
            size: 14
          },
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        titleColor: theme === 'dark' ? '#e5e7eb' : '#111827',
        bodyColor: theme === 'dark' ? '#d1d5db' : '#4b5563',
        borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          font: {
            size: 12
          }
        },
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          font: {
            size: 12
          }
        },
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
          drawBorder: false
        }
      }
    }
  };

  return (
    <div className="h-[350px] w-full">
      <Line options={options} data={data} />
    </div>
  );
};

export default AnalyticsChart;