import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// Strict 4-color enterprise palette: Blue (#3B82F6), Green (#10B981), Orange (#F59E0B), Red (#EF4444)
const PALETTE_4_COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'];

const IntentPieChart = ({ data = {} }) => {
  const labels = Object.keys(data).length > 0 ? Object.keys(data) : ['Payment Issue', 'Price Sensitive', 'Buy Later', 'Buy Now', 'Window Shopper'];
  const values = Object.keys(data).length > 0 ? Object.values(data) : [35, 25, 15, 15, 10];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Sessions Count',
        data: values,
        backgroundColor: labels.map((_, i) => PALETTE_4_COLORS[i % 4]),
        borderWidth: 2,
        borderColor: '#1E293B'
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 16
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#F8FAFC',
          font: { family: 'Inter', size: 12, weight: '500' },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#F8FAFC',
        bodyColor: '#94A3B8',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  return (
    <div className="h-72 p-2">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default IntentPieChart;
