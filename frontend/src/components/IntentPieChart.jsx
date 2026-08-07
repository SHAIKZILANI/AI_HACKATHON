import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const IntentPieChart = ({ data = {} }) => {
  const labels = Object.keys(data).length > 0 ? Object.keys(data) : ['Payment Issue', 'Price Sensitive', 'Buy Later', 'Buy Now', 'Window Shopper'];
  const values = Object.keys(data).length > 0 ? Object.values(data) : [35, 25, 15, 15, 10];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Sessions Count',
        data: values,
        backgroundColor: [
          '#f43f5e', // rose
          '#f59e0b', // amber
          '#3b82f6', // blue
          '#10b981', // emerald
          '#8b5cf6', // purple
        ],
        borderWidth: 1,
        borderColor: '#0f172a'
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 }
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default IntentPieChart;
